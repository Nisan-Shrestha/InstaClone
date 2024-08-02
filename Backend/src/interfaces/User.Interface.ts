import { UUID } from "node:crypto";

export interface IUser {
  id: UUID;
  username: string;
  name: string;
  email: string;
  password: string | null;
  role: Roles;
  privacy: Privacy;
  pfpUrl: string | null;
  bio: string | null;
  phone: string | null;
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
