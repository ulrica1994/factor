import Vue from "vue"
import VueRouter from "vue-router"
declare module "vue/types/vue" {
  interface VueConstructor {
    $router: VueRouter;
    metaInfoCore: () => {};
    observable: <T>(obj: T) => T;
  }

  interface Vue {
    metaInfoCore(): object;
    observable: <T>(obj: T) => T;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    metaInfoCore?: () => {};
    serverPrefetch?(): Promise<void>;
  }
}