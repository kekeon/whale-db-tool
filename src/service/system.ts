import { system } from "@/types/system";
import request, { PostOpt } from "@/utils/request";
import { SYSTEM_USER } from "./api";

// 基础查询
export async function systemLogin(props: system.Login, option?: PostOpt) {
    return request.post<system.LoginRes>(SYSTEM_USER, props, option);
  }