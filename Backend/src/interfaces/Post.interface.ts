import { UUID } from "crypto";

export interface IPost {
  id: UUID;
  userId: UUID;
  caption: string;
  createdAt: Date;
}

export interface IHastag {
  id: UUID;
  name: string;
}
