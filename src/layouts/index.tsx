import React from "react";
import styles from "./style/index.module.less";
import { renderRoutes, RouteConfig } from "react-router-config";

export type BasicLayoutComponent<P> = React.FC<P>;

export interface BasicLayoutProps extends React.Props<HTMLElement>

const BasicLayout: BasicLayoutComponent<BasicLayoutProps & RouteConfig> = (props) => {
  return (
    <div className={styles.normal}>{renderRoutes(props.route.routes)}</div>
  );
};

export default BasicLayout;
