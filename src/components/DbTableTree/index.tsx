import React, { useEffect, useState } from "react";
import style from "./index.module.less";
import { Tree } from "antd";
import { TreeProps } from "antd/lib/tree/index";

type DbTableTreeItem = {
  name: string;
  list: DbTableTreeItem[];
};

interface DbTableTreeProps {
  list: DbTableTreeItem[];
  config: TreeProps;
}

type DbTableTreePropsExtra = DbTableTreeProps;

const DbTableTree: React.FC<DbTableTreePropsExtra> = (props) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [listData, setListData] = useState<DbTableTreeItem[]>(props.list || []);

  useEffect(() => {
    if (Array.isArray(props.list)) {
      setListData(props.list);
    }
  }, [props.list]);

  const onExpand = (expandedKeys: string[]) => {
    setExpandedKeys(expandedKeys);
  };

  const loop = (data: any, pk?: string) =>
    data.map((item: DbTableTreeItem, inx: number) => {
      const index = searchValue ? item.name.indexOf(searchValue) : -1;
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const name =
        index > -1 && searchValue ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.name}</span>
        );

      let key = pk ? `${pk}_${inx}` : `${inx}`;
      if (item.list) {
        return { title: name, key: key, children: loop(item.list, key) };
      }

      return {
        title: name,
        key: key,
      };
    });

  return (
    <div className={style["db-table-tree"]}>
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={true}
        treeData={loop(listData)}
        {...props.config}
      />
    </div>
  );
};

export default DbTableTree;
