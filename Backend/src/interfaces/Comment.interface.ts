import { UUID } from "crypto";

export interface IComment {
  id: UUID;
  uid: UUID;
  postId: UUID;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: UUID;
}
