import { UUID } from "crypto";

export interface IGetUserPagedQuery {
  q?: string;
  page?: number;
  size?: number;
}

export interface IGetPostPagedQuery {
  tag?: string;
  userIds?: UUID[];
  page?: number;
  size?: number;
}

export interface IGetCommentPagedQuery {
  page?: number;
  size?: number;
}
export interface IGetHashtagFilter {
  q: string;
  page?: number;
  size?: number;
}
