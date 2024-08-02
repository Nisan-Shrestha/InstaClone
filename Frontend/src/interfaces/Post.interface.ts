export interface IPost {
  username: string;
  pfpUrl: string | null;
  caption: string;
  id: string;
  mediaUrl: string[];
  likeCount: number;
  createdAt: Date;
  liked: boolean;
  saved: boolean;
}
