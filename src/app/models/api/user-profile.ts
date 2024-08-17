import { UserData } from "./userData";

export type UserProfile = UserData & {
  images: ImageUserProfile[];
}

export interface ImageUserProfile {
  imageId: number;
  imageURL: string;
  name: string;
  description: string | null;
  series_name: string;
  last_update: string;
  today_score: number;
  today_rank: number;
  yesterday_score: number;
  yesterday_rank: number;
  isPortrait?: boolean;
}
