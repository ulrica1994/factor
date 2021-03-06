import { addContentRoutes } from "@factor/api"
import { addPageTemplate } from "@factor/templates"

import "./extend"

addPageTemplate({
  name: "Factor Basic",
  slug: "factor-basic",
  component: (): Promise<any> => import("./page-template-default.vue"),
})

addContentRoutes({
  key: "docsRoutes",
  routes: () => {
    return [
      {
        path: "/",
        component: (): Promise<any> => import("./home/v-home.vue"),
      },
      {
        path: "/install",
        component: (): Promise<any> => import("./home/v-install.vue"),
        meta: { auth: true },
      },
      {
        path: `/themes`,
        component: (): Promise<any> => import("./extend/wrap.vue"),
        children: [
          {
            path: `/`,
            component: (): Promise<any> => import("./extend/index.vue"),
          },
          {
            path: `/theme/:permalink`,
            component: (): Promise<any> => import("./extend/single.vue"),
          },
        ],
      },
      {
        path: `/plugins`,
        component: (): Promise<any> => import("./extend/wrap.vue"),
        children: [
          {
            path: `/`,
            component: (): Promise<any> => import("./extend/index.vue"),
          },
          {
            path: `/plugin/:permalink`,
            component: (): Promise<any> => import("./extend/single.vue"),
          },
        ],
      },
    ]
  },
})
