import { UUID } from "crypto";
import path from "path";
import { BadRequest } from "../error/BadRequest";
import { Conflict } from "../error/Conflict";
import { IUser } from "../interfaces/User.Interface";
import loggerWithNameSpace from "../utils/logger";
import { BaseModel } from "./base.Model";
import {
  IGetHashtagFilter,
  IGetPostPagedQuery,
  IGetUserPagedQuery,
} from "../interfaces/Utils.Interface";
import { IPost } from "../interfaces/Post.interface";
import { Internal } from "../error/Internal";

const pathToUserData = path.join(__dirname, "../data/posts.json");
const logger = loggerWithNameSpace("PostModel");

export class PostModel extends BaseModel {
  static count(filter: IGetPostPagedQuery) {
    // const { q } = filter;
    let query;
    // if (q) {
    //   query = this.queryBuilder()
    //     .count("*")
    //     .table("posts")
    //     // .whereLike("name", `%${q}%`)
    //     .first();
    // } else
    query = this.queryBuilder().count("*").table("posts").first();

    return query;
  }

  static async getIfUserLikedPost(uid: UUID, pid: UUID): Promise<boolean> {
    let query = await this.queryBuilder()
      .select("*")
      .table("likes")
      .where("userId", uid)
      .andWhere("postId", pid);
    return query.length > 0;
  }

  static async getIfUserSavedPost(uid: UUID, pid: UUID): Promise<boolean> {
    let query = await this.queryBuilder()
      .select("*")
      .table("savedPosts")
      .where("userId", uid)
      .andWhere("postId", pid);
    return query.length > 0;
  }

  static async getPostByID(id: UUID) {
    const query = await this.queryBuilder()
      .select("*")
      .table("posts")
      .where("id", id)
      .first();

    return query;
  }

  static async getPublicPostsRandom(filter: IGetPostPagedQuery) {
    // const { q } = filter;
    const query = this.queryBuilder()
      .select("posts.*")
      .table("posts")
      .join("users", "posts.userId", "users.id")
      .where("users.privacy", "Public")
      .limit(filter.size)
      .offset((filter.page - 1) * filter.size);

    if (filter.tag) {
      console.log("Filtering by tag: ", filter.tag);
      let tagId = await this.getHashtagIdByName(filter.tag);
      console.log("Tag ID: ", tagId);
      if (!tagId) {
        return [];
      }
      query
        .join("postHastags", "posts.id", "postHastags.postId")
        .where("postHastags.hashtagId", tagId.id);
    }
    return await query;
  }

  // getHashtagIdByName
  static async getHashtagIdByName(tag: string) {
    let query = await this.queryBuilder()
      .select("id")
      .table("hashtags")
      .where("name", tag)
      .first();
    return query;
  }

  // static getFilteredHashtagPosts(filter: IGetPostByHastagFilter) {
  //   // const { q } = filter;
  //   const query = this.queryBuilder()
  //     .select("posts.*")
  //     .table("posts")
  //     .join("users", "posts.userId", "users.id")
  //     .where("users.privacy", "Public")
  //     .join("postHastags", "posts.id", "postHastags.postId")
  //     .andWhereLike()
  //     .limit(filter.size)
  //     .offset((filter.page - 1) * filter.size);

  //   return query;
  // }
  static getFilteredHashtags(filter: IGetHashtagFilter) {
    // const { q } = filter;
    const query = this.queryBuilder()
      .select("*")
      .table("hashtags")
      .whereLike("name", `%${filter.q}%`)
      .limit(filter.size)
      .offset((filter.page - 1) * filter.size);

    return query;
  }

  static getUserPostsPaged(uid: UUID, filter: IGetPostPagedQuery) {
    let { page, size } = filter;
    if (page < 1) page = 1;
    if (size < 1) size = 1;
    const query = this.queryBuilder()
      .select("*")
      .table("posts")
      .where("userId", uid)
      .limit(size)
      .offset((page - 1) * size);

    return query;
  }

  static getPostList(filter: IGetPostPagedQuery) {
    const { userIds, page, size } = filter;
    const query = this.queryBuilder()
      .select("*")
      .table("posts")
      .whereIn("userId", userIds)
      .limit(size)
      .offset((page - 1) * size);
    return query;
  }

  static async createPost(postDetails: Partial<IPost>, user: Partial<IUser>) {
    // id, userId,caption, createdAt
    const postToCreate = {
      ...postDetails,
      createdAt: new Date(),
    };
    logger.info("trying to create: ", postToCreate);
    let query = await this.queryBuilder()
      .insert({
        id: crypto.randomUUID(),
        userId: user.id,
        caption: postDetails.caption,
        createdAt: new Date(),
      })
      .table("posts")
      .returning("*");
    // logger.info("run query: " + query.toString());
    // await query;
    logger.info(query);
    return query[0];
  }

  static async updatePostCaption(pid: UUID, caption: string) {
    let query = await this.queryBuilder()
      .update({ caption })
      .table("posts")
      .where("id", pid)
      .returning("*");
    return query[0];
  }

  static async addMediaUrl(postId: UUID, mediaUrl: string, order: number) {
    let query = await this.queryBuilder()
      .insert({ id: crypto.randomUUID(), mediaUrl, postId, order })
      .table("postMedia")
      .returning("*");
    return query[0];
  }

  static async getPostMedia(postId: UUID) {
    let query = await this.queryBuilder()
      .select("mediaUrl")
      .table("postMedia")
      .where("postId", postId)
      .orderBy("order");
    return query;
  }

  static async getHashtagByName(tag: string) {
    let query = await this.queryBuilder()
      .select("*")
      .table("hashtags")
      .where("name", tag)
      .first();
    return query;
  }

  static async createHastagEntry(tag: string) {
    let query = await this.queryBuilder()
      .insert({ id: crypto.randomUUID(), name: tag })
      .table("hashtags")
      .returning("*");
    return query[0];
  }

  static async addPostToHashtag(postId: UUID, tagId: UUID) {
    let query = await this.queryBuilder()
      .insert({ id: crypto.randomUUID(), postId, hashtagId: tagId })
      .table("postHastags")
      .returning("*");
    return query[0];
  }

  static async deletePost(postId: UUID) {
    // try {
    await this.queryBuilder().transaction(async (trx) => {
      // Delete the media
      await trx("postMedia").delete().where("postId", postId);

      // Delete the hashtags
      await trx("postHastags").delete().where("postId", postId);

      // Delete the likes
      await trx("likes").delete().where("postId", postId);

      // Delete the comments
      await trx("commnents").delete().where("postId", postId);

      // Finally, delete the post
      await trx("posts").delete().where("id", postId);
    });
    logger.info("All related records deleted successfully.");
    return true;
    // } catch (error) {
    //   logger.error("Error deleting post: ", error);
    //   return false;
    // }
  }

  static async unlinkPostHastags(pid: UUID) {
    try {
      let rowsDeleted = await PostModel.queryBuilder()
        .delete()
        .table("postHastags")
        .where("postId", pid);

      console.log(`Successfully deleted ${rowsDeleted} rows.`);
      return rowsDeleted;
    } catch (error) {
      console.error("Error deleting records:", error);
      throw new Internal("Error deleting postHastags");
    }
  }
}
