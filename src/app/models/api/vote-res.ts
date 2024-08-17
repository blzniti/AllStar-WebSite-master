export interface VoteRes {
  winner: {
    oldScore: number,
    newScore: number,
    expected: number,
  },
  loser: {
    oldScore: number,
    newScore: number,
    expected: number,
  }
}