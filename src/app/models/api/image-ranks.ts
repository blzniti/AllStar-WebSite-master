export interface ImageRank {
  imageId:         number;
  imageURL:        string;
  name:            string;
  today_score:     number;
  today_rank:      number;
  yesterday_score: number;
  yesterday_rank:  number;
  isPortrait?:       boolean;
}
