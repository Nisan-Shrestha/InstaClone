import { UUID } from "crypto";
import path from "path";
import { BadRequest } from "../error/BadRequest";
import { Conflict } from "../error/Conflict";
import { IUser } from "../interfaces/User.Interface";
import loggerWithNameSpace from "../utils/logger";
import { BaseModel } from "./base.Model";
import {
  IGetCommentPagedQuery,
  IGetPostPagedQuery,
  IGetUserPagedQuery,
} from "../interfaces/Utils.Interface";
import { IPost } from "../interfaces/Post.interface";
import { Internal } from "../error/Internal";
import { IComment } from "../interfaces/Comment.interface";

const pathToUserData = path.join(__dirname, "../data/posts.json");
const logger = loggerWithNameSpace("PostModel");

export class CommentModel extends BaseModel {
  // static count(filter: IGetCommentPagedQuery) {
  //   let query;
  //   if (!filter.parentId)
  //     query = this.queryBuilder().count("*").table("posts").first();
  //   else
  //     query = this.queryBuilder()
  //       .count("*")
  //       .table("posts")
  //       .where("parentId", filter.parentId)
  //       .first();
  //   return query;
  // }
  // implement getCommentById
  static async getCommentById(id: UUID) {
    const query = await this.queryBuilder()
      .select("*")
      .table("commnents")
      .where("id", id)
      .first();
    return query;
  }
  static async getCommentForPost(pid: UUID, filter: IGetCommentPagedQuery) {
    if (!filter.size) filter.size = 10;
    if (!filter.page) filter.page = 1;
    return await this.queryBuilder()
      .select("*")
      .table("commnents")
      .where("postId", pid)
      .limit(filter.size)
      .offset((filter.page - 1) * filter.size);
  }

  static async getParentCommentForPost(
    postId: UUID,
    filter: IGetCommentPagedQuery
  ) {
    if (!filter.size) filter.size = 10;
    if (!filter.page) filter.page = 1;
    return await this.queryBuilder()
      .select("*")
      .table("commnents")
      .where("postId", postId)
      .andWhere("parentId", null)
      .limit(filter.size)
      .offset((filter.page - 1) * filter.size);
  }

  static async getChildrenForComment(
    parentId: UUID,
    filter: IGetCommentPagedQuery
  ) {
    if (!filter.size) filter.size = 10;
    if (!filter.page) filter.page = 1;
    return await this.queryBuilder()
      .select("*")
      .table("commnents")
      .where("parentId", parentId)
      .limit(filter.size)
      .offset((filter.page - 1) * filter.size);
  }

  static async getChildCount(parentId: UUID): Promise<number> {
    return (
      await this.queryBuilder()
        .count("*")
        .table("commnents")
        .where("parentId", parentId)
        .first()
    ).count;
  }

  static async createComment(comment: IComment) {
    const query = await this.queryBuilder()
      .insert({
        id: comment.id,
        postId: comment.postId,
        userId: comment.uid,
        parentId: comment.parentId || null,
        content: comment.content,
      })
      .into("commnents")
      .returning("*");
    return query;
  }

  static async updateComment(commentId: UUID, comment: string) {
    const query = await this.queryBuilder()
      .update({
        content: comment,
      })
      .table("commnents")
      .where("id", commentId)
      .returning("*");
    return query;
  }

  static async deleteComment(id: UUID) {
    const query = await this.queryBuilder()
      .delete()
      .table("commnents")
      .where("id", id)
      .returning("*");
    return query;
  }
}
