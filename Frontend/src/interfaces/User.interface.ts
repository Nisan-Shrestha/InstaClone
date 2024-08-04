export interface IUser {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string | null;
  role: Roles;
  privacy: Privacy;
  pfpUrl: string | null;
  bio: string | null;
  phone: string | null;
  following?: FollowStatus;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
}

export interface GetUserQuery {
  q?: string;
  page?: number;
  size?: number;
}

export enum Roles {
  Regular = "Regular",
  Admin = "Admin",
}
export enum Privacy {
  Private = "Private",
  Public = "Public",
}
export enum FollowStatus {
  Following = "Following",
  Pending = "Pending",
  Notfollowing = "Notfollowing",
}
