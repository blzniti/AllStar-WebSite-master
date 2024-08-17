export interface userDataToken {
  userId: string,
  username: string,
  displayName: string;
  image: string,
  type: "admin" | "user",
  iat: number,
  exp: number
}
