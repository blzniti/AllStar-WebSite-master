export interface AuthRes {
  status: "ok" | "error",
  message: string,
  token?: string
}
