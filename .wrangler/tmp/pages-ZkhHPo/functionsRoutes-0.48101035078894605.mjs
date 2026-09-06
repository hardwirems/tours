import { onRequestGet as __go___slug___ts_onRequestGet } from "/Users/pauliiesicloudaccount/guanacaste-tours/functions/go/[[slug]].ts"

export const routes = [
    {
      routePath: "/go/:slug*",
      mountPath: "/go",
      method: "GET",
      middlewares: [],
      modules: [__go___slug___ts_onRequestGet],
    },
  ]