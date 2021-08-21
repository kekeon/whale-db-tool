import React from "react";
import { RouteConfig } from "react-router-config";

import App from "../App";
import Index from "../pages/index";
import Layouts from "../layouts/BasicLayout";
import Overview from "../pages/overview/index";
import Mysql from "../pages/mysql/index";

export const routes: RouteConfig[] = [
  {
    component: App,
    routes: [
      {
        path: "/login",
        exact: true,
        component: Index,
      },
      {
        path: "/main",
        // exact: true,
        component: Layouts,
        routes: [
          {
            path: "/main/overview",
            exact: true,
            component: Overview,
          },
          {
            path: "/main/mysql",
            exact: true,
            component: Mysql,
          },
        ],
      },
    ],
  },
];
