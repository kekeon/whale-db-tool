export namespace system {
  export interface Login {
    account: string
    password: string
  }

  export interface LoginRes {
    id: number
    token: string
  }
}
