export interface APIResponse {
  "status": "ok" | "error",
  "message": string,
  "data": any | any[] | null | undefined,
}