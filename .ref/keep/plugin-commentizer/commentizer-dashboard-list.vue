<template>
  <div>
    <dashboard-grid-controls>
      <dashboard-grid-actions
        :actions="controlActions"
        :loading="sending"
        @action="handleAction($event)"
      />
      <dashboard-grid-filter filter-id="status" :filter-tabs="tabs" />
    </dashboard-grid-controls>

    <dashboard-grid :structure="grid()" :rows="comments" @select-all="selectAll($event)">
      <template #select="{value, row}">
        <input
          v-model="selected"
          type="checkbox"
          class="checkbox"
          label
          :value="row._id"
        />
      </template>
      <template #comment="{row}">{{ row.content }}</template>
      <template #name="{row}">{{ row.name }}</template>
      <template #email="{row}">{{ row.email }}</template>
    </dashboard-grid>
  </div>
</template>
<script>
import {
  dashboardGridControls,
  dashboardGridFilter,
  dashboardGridActions
} from "@factor/dashboard"
import { getStatusCount, requestPostSingle } from "@factor/post"
import { toLabel, stored, getPermalink, omit } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  components: { dashboardGridControls, dashboardGridFilter, dashboardGridActions },
  props: {
    postId: { type: String, required: true },
    postType: { type: String, default: "page" },
    loading: { type: Boolean, default: false },
    sending: { type: Boolean, default: false }
  },
  data() {
    return {
      comments: [],
      loadingAction: false,
      selected: []
    }
  },
  computed: {
    post() {
      return stored(this.postId) || {}
    },
    // TODO: Fix - Requires population to work!
    // comments() {
    //   return this.post.commentizerComments || []
    // },
    // TODO: Fix - Fake meta data
    meta() {
      return this.comments ? { total: this.comments.length } : { total: 0 }
    },
    tabs() {
      return [`all`, `trash`].map((key) => {
        const count =
          key == "all" ? this.meta.total : getStatusCount({ meta: this.meta, key })

        return {
          name: toLabel(key),
          value: key == "all" ? "" : key,
          count
        }
      })
    },
    controlActions() {
      return [
        {
          value: "trash",
          name: "Move to Trash",
          condition: (query) => query.status != "trash"
        },
        { value: "delete", name: "Permanently Delete" }
      ].filter((_) => {
        return _.value != this.$route.query.status
      })
    }
  },
  async created() {
    // TODO: Fix - Manually populate comments
    this.comments = await Promise.all(
      this.post.commentizerComments.map(async (id) => {
        return await requestPostSingle({ postType: "commentizer", _id: id })
      })
    )
  },
  methods: {
    handleAction(action) {
      this.$emit("action", {
        action,
        selected: this.selected
      })
    },
    selectAll(val) {
      this.selected = !val ? [] : this.comments.map((_) => _._id)
    },
    fields(item) {
      const rest = omit(item, ["_id", "createdAt", "content", "email", "name"])

      return Object.values(rest)
    },
    postlink(postType, permalink, root = true) {
      return getPermalink({ postType, permalink, root })
    },
    grid() {
      return [
        {
          _id: "select",
          width: "40px"
        },
        {
          _id: "comment",
          name: "comment",
          width: "minmax(100px, 1fr)"
        },
        {
          _id: "name",
          name: "name",
          width: "170px"
        },
        {
          _id: "email",
          name: "email",
          width: "170px"
        }
      ]
    }
  }
})
</script>
<style lang="less">
.commentizer-dashboard-list-table {
  .dbt-body-row {
    font-size: 0.85em;
    .message {
      line-height: 1.4;
    }
    .contact-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
      .dat {
        strong {
          display: block;
        }
      }
    }
  }
}
</style>
