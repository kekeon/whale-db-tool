declare interface IKV<T> {
  [index: string]: T;
}

namespace conmon {
  export type connectItem = {
    another_name: string;
    host: string;
    name: string;
    password: string;
    port: number;
  };

  export type connectUuid = {
    uuid: string;
  };

  export type cuid = connectItem & connectUuid;

}
