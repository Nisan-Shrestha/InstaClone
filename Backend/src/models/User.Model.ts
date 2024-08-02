import { UUID } from "crypto";
import path from "path";
import { BadRequest } from "../error/BadRequest";
import { Conflict } from "../error/Conflict";
import { IUser } from "../interfaces/User.Interface";
import { IGetUserPagedQuery } from "../interfaces/Utils.Interface";
import loggerWithNameSpace from "../utils/logger";
import { BaseModel } from "./base.Model";

const pathToUserData = path.join(__dirname, "../data/users.json");
const logger = loggerWithNameSpace("UserModel");

export class UserModel extends BaseModel {
  static count(filter: IGetUserPagedQuery) {
    const { q } = filter;
    let query;
    if (q) {
      query = this.queryBuilder()
        .count("*")
        .table("users")
        .whereLike("name", `%${q}%`)
        .first();
    } else query = this.queryBuilder().count("*").table("users").first();

    return query;
  }

  static getUserInfoById(id: UUID): Promise<IUser> {
    const query = this.queryBuilder()
      .select("*")
      .table("users")
      .first()
      .where("id", id);

    return query;
  }

  static getAllFilteredUser(filter: IGetUserPagedQuery) {
    const { q } = filter;
    const query = this.queryBuilder()
      .select("id", "name", "username", "email", "pfpUrl")
      .table("users")
      .limit(filter.size)
      .offset((filter.page - 1) * filter.size);

    if (q) {
      query.whereLike("username", `%${q}%`).andWhereRaw("username != id::text");
    }

    return query;
  }

  static getUserByEmail(email: string) {
    const user = this.queryBuilder()
      .select("*")
      .table("users")
      .where("email", email)
      .first();
    return user;
  }

  static async getUserByUsername(username: string): Promise<IUser> {
    const user = (await this.queryBuilder()
      .select("*")
      .table("users")
      .where("username", username)
      .first()) as IUser;
    return user;
  }

  static async createUser(user: Partial<IUser>) {
    const userExists = await UserModel.getUserByEmail(user.email);
    logger.info("user exists: " + !!userExists);
    if (userExists) {
      throw new Conflict(`User with email ${user.email} already exists`);
    }
    const userToCreate = {
      ...user,
      createdAt: new Date(),
    };
    logger.info("trying to create: ", userToCreate);
    let query = await this.queryBuilder()
      .insert(userToCreate)
      .table("users")
      .returning("*");
    logger.info("run query: " + query.toString());
    // await query;
    logger.info(query);
    return {
      id: query[0].id,
      name: query[0].name,
      username: query[0].username,
      email: query[0].email,
      role: query[0].roles,
    };
  }

  static async updateUserPicture(userId: UUID, pictureLink: string) {
    const user = await this.queryBuilder()
      .select("*")
      .table("users")
      .first()
      .where("id", userId);

    if (!user) {
      throw new BadRequest(`User with id ${userId} not found`);
    }

    const query = await this.queryBuilder()
      .update({ pfpUrl: pictureLink, updatedAt: new Date() })
      .table("users")
      .where("id", userId)
      .returning("*");
    // .first();
    console.log("Query: ", query.toString());
    // await query;
    return query[0];
  }

  static async updateLoggedInUserInfo(id: UUID, data: Partial<IUser>) {
    let userToUpdate = await this.queryBuilder()
      .select("*")
      .table("users")
      .first()
      .where("id", id);
    if (!userToUpdate) {
      throw new BadRequest(
        `User with id: ${id} not found, auth token might be invalid`
      );
    }

    userToUpdate = { ...userToUpdate, ...data, updatedAt: new Date() };

    const query = this.queryBuilder()
      .update(userToUpdate)
      .table("users")
      .where({ id });

    await query;
    return userToUpdate;
  }

  static async updateLoggedInUserPassword(id: UUID, newHashedPassword: string) {
    const query = await this.queryBuilder()
      .update("password", newHashedPassword)
      .table("users")
      .where({ id })
      .returning("*")
      .first();
    return query;
  }
  static async updateLoggedInUserUsername(id: UUID, newUsername: string) {
    const query = await this.queryBuilder()
      .update("username", newUsername)
      .table("users")
      .where({ id })
      .returning("*")
      .first();
    return query;
  }

  static async deleteUser(id: UUID) {
    let userToDelete = await this.queryBuilder()
      .select("*")
      .table("users")
      .first()
      .where("id", id);
    if (!userToDelete) return false;
    let Response = await this.queryBuilder()
      .delete()
      .table("users")
      .where({ id })
      .returning("*")
      .first();

    return Response;
  }

  static async getIfAFollowsB(idA: UUID, idB: UUID): Promise<boolean> {
    let result = await this.queryBuilder()
      .select("*")
      .table("follow")
      .where("follow.followerId", idA)
      .andWhere("follow.followingId", idB);
    return result.length > 0;
  }

  static async getIfARequestedFollowsB(idA: UUID, idB: UUID): Promise<boolean> {
    let result = await this.queryBuilder()
      .select("*")
      .table("followRequests")
      .where("followRequests.requesterId", idA)
      .andWhere("followRequests.requestedId", idB)
      .andWhere("status", "Pending");
    return result.length > 0;
  }

  static async createFollow(idA: UUID, idB: UUID) {
    let result = await this.queryBuilder()
      .insert({
        id: crypto.randomUUID(),
        followerId: idA,
        followingId: idB,
        createdAt: new Date(),
      })
      .table("follow")
      .returning("*");
    return result[0];
  }
  static async getFollowRequests(id: UUID) {
    let result = await this.queryBuilder()
      .select("*")
      .table("followRequests")
      .where("requestedId", id);
    return result;
  }

  static async createFollowRequest(idA: UUID, idB: UUID) {
    let result = await this.queryBuilder()
      .insert({
        id: crypto.randomUUID(),
        requesterId: idA,
        requestedId: idB,
        createdAt: new Date(),
        status: "Pending",
      })
      .table("followRequests")
      .returning("*");
    return result[0];
  }

  static async deleteFollow(idA: UUID, idB: UUID) {
    let result = await this.queryBuilder()
      .delete()
      .table("follow")
      .where("followerId", idA)
      .andWhere("followingId", idB)
      .returning("*");
    return result[0];
  }
  static async deleteFollowRequest(idA: UUID, idB: UUID) {
    let result = await this.queryBuilder()
      .table("followRequests")
      .delete()
      .where("requesterId", idA)
      .andWhere("requestedId", idB)
      .returning("*");
    return result[0];
  }

  static async getUserFollowingList(id: UUID) {
    let followingList = await this.queryBuilder()
      .select("username", "name", "users.id as id", "pfpUrl")
      .table("users")
      .join("follow", "users.id", "follow.followingId")
      .where("follow.followerId", id);
    return followingList;
  }

  static async getUserFollowersList(id: UUID) {
    let followerList = await this.queryBuilder()
      .select("username", "name", "users.id as id", "pfpUrl")
      .table("users")
      .join("follow", "users.id", "follow.followerId")
      .where("follow.followingId", id);
    return followerList;
  }

  static async getUserPosts(id: UUID) {
    let postList = await this.queryBuilder()
      .select("*")
      .table("posts")
      .where("userId", id);
    return postList;
  }

  static async getUserSavedPosts(id: UUID) {
    let postList = await this.queryBuilder()
      .select("posts.*")
      .table("likes")
      .join("posts", "likes.postId", "posts.id")
      .where("likes.userId", id);
    return postList;
  }
  static async getUserLikedPosts(id: UUID) {
    let postList = await this.queryBuilder()
      .select("posts.*")
      .table("savedPosts")
      .join("posts", "savedPosts.postId", "posts.id")
      .where("savedPosts.userId", id);
    return postList;
  }

  static async likePost(userId: UUID, postId: UUID) {
    let result = await this.queryBuilder()
      .insert({
        id: crypto.randomUUID(),
        userId,
        postId,
        createdAt: new Date(),
      })
      .into("likes")
      .returning("*");
    return result[0];
  }

  static async unlikePost(userId: UUID, postId: UUID) {
    let result = await this.queryBuilder()
      .delete()
      .table("likes")
      .where("userId", userId)
      .andWhere("postId", postId)
      .returning("*");
    return result[0];
  }

  static async savePost(userId: UUID, postId: UUID) {
    let result = await this.queryBuilder()
      .insert({
        id: crypto.randomUUID(),
        userId,
        postId,
        createdAt: new Date(),
      })
      .into("savedPosts")
      .returning("*");
    return result[0];
  }

  static async unsavePost(userId: UUID, postId: UUID) {
    let result = await this.queryBuilder()
      .delete()
      .table("savedPosts")
      .where("userId", userId)
      .andWhere("postId", postId)
      .returning("*");
    return result[0];
  }
}
