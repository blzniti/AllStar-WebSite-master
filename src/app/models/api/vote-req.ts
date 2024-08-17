export interface VoteReq {
  userId?: number;
  browserId?: string;
  winnerId: number;
  loserId: number;
}