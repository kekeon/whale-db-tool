import React, { useState } from "react";
import style from "./index.module.less";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import classNames from "classnames";

interface Props {
  list: any;
  onDelete: (item: conmon.cuid) => void;
  onAdd: () => void;
  onEdit: (item: conmon.cuid) => void;
  onChange: (item: conmon.cuid) => void;
}

type PropsExtra = Props;

const DbConnectList: React.FC<PropsExtra> = (props) => {
  const [uuidIndex, setUuidIndex] = useState<string>();

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const handleChange = (item: conmon.cuid) => {
    setUuidIndex(item?.uuid);
    props.onChange && props.onChange(item);
  };

  return (
    <div className={style["db-connect-lsit"]}>
      {props.list && props.list.length
        ? props.list.map((item: conmon.cuid, index: number) => (
            <div
              className={classNames("db-item-wrap", {
                ml10: index > 0,
                "db-item-active": uuidIndex === item.uuid,
              })}
              key={item.uuid}
              onClick={() => {
                handleChange(item);
              }}
            >
              <span className="db-item">{item.another_name}</span>
              <span className="db-edit-icon-wrap">
                <EditOutlined
                  className="ml5"
                  onClick={() => {
                    props.onEdit(item);
                  }}
                />
                <DeleteOutlined
                  className="ml5"
                  onClick={() => {
                    props.onDelete(item);
                  }}
                />
              </span>
            </div>
          ))
        : null}
      <PlusOutlined className="ml10 cursor" onClick={props.onAdd} />
    </div>
  );
};
export default DbConnectList;
