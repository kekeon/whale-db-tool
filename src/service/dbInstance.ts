import { CONNECT_LIST } from "@/constant/js/storageKey";
import { PostOpt } from "@/utils/request";
import storage from "@/utils/storage";
import { uuid } from "@/utils/utils";

// 基础查询
export async function addConnect(props: conmon.connectItem, option?: PostOpt) {
  let payload: conmon.cuid = {
    ...props,
    uuid: uuid(),
  };
  let res: (conmon.cuid)[] = storage().getLocal(
    CONNECT_LIST,
    []
  );
  res.push(payload);
  storage().setLocal(CONNECT_LIST, res, -1);
  return Promise.resolve(payload);
}

export async function listConnect() {
  let res: (conmon.cuid)[] = storage().getLocal(
    CONNECT_LIST,
    []
  );
  return Promise.resolve(res);
}

export async function updateConnect(
  uuid: string,
  props: conmon.connectItem,
  option?: PostOpt
) {
  let res: conmon.cuid[] = storage().getLocal(
    CONNECT_LIST,
    []
  );
  let inx = res.findIndex((item) => item.uuid === uuid);
  if (inx < 0) {
    return Promise.reject({ msg: "不存在" });
  }

  res[inx] = { ...res[inx], ...props };
  storage().setLocal(CONNECT_LIST, res, -1);
  return Promise.resolve(res[inx]);
}

export async function deleteDelete(uuid: string, option?: PostOpt) {
  let res: conmon.cuid[] = storage().getLocal(
    CONNECT_LIST,
    []
  );
  let inx = res.findIndex((item) => item.uuid === uuid);
  if (inx < 0) {
    return Promise.reject({ msg: "不存在" });
  }

  res.splice(inx, 1);
  storage().setLocal(CONNECT_LIST, res, -1);
  return Promise.resolve(uuid);
}
