import { UUID } from "crypto";
import { NotFound } from "../error/NotFound";
import * as CommentModel from "../models/Comment.Model";
import * as UserModel from "../models/User.Model";
import loggerWithNameSpace from "../utils/logger";
// import { UserModel } from "../models/User";
// import { generateUsername } from "unique-username-generator";
import { IGetCommentPagedQuery } from "../interfaces/Utils.Interface";
import { IUser } from "../interfaces/User.Interface";
import { IComment } from "../interfaces/Comment.interface";
import { Internal } from "../error/Internal";
import { userInfo } from "os";
import { Unauthorized } from "../error/Unauthorized";
import { BadRequest } from "../error/BadRequest";

const logger = loggerWithNameSpace("Comment Services");

export async function getParentCommentForPost(
  pid: UUID,
  filter: IGetCommentPagedQuery
) {
  logger.info(`Getting Comment info for pid: ${pid}`);
  let data = await CommentModel.CommentModel.getParentCommentForPost(
    pid,
    filter
  );

  if (!data) {
    logger.error(
      `Comment for Post with pid: ${pid} not found: Model Layer returned Null`
    );
    throw new NotFound(
      `Comment for Post with pid: ${pid} not found: Model Layer returned Null`
    );
  }
  data = await FillCommentMeta(data);
  return data;
}

export async function getChildrenForComment(
  cid: UUID,
  filter: IGetCommentPagedQuery
) {
  logger.info(`Getting child Comment info for cid: ${cid}`);
  let data = await CommentModel.CommentModel.getChildrenForComment(cid, filter);

  if (!data) {
    logger.error(
      `child Comment for Comment with cid: ${cid} not found: Model Layer returned Null`
    );
    throw new NotFound(
      `child Comment for Comment with cid: ${cid} not found: Model Layer returned Null`
    );
  }
  data = await FillCommentMeta(data);
  return data;
}

export async function createComment(
  postId: UUID,
  content: string,
  userInfo: IUser,
  parentId?: UUID
) {
  logger.info(`Creating new COmment for Post with pid: ${postId}`);
  if (!content) {
    throw new BadRequest(`Content cannot be empty`);
    return;
  }
  let commentToCreate: IComment = {
    id: crypto.randomUUID(),
    postId: postId,
    uid: userInfo.id,
    parentId: parentId || null,
    content: content,
    createdAt: new Date(),
  };
  let data = await CommentModel.CommentModel.createComment(commentToCreate);

  if (!data) {
    logger.error(`Comment not created: Model Layer returned Null`);
    throw new Internal(`Comment not created: Model Layer returned Null`);
  }
  data = await FillCommentMeta(data);
  return data;
}

export async function updateComment(
  commentId: UUID,
  content: string,
  user: IUser
) {
  logger.info(`Updating Comment with id: ${commentId}`);
  const existingComment = await CommentModel.CommentModel.getCommentById(
    commentId
  );
  if (!existingComment)
    throw new NotFound(
      `Comment with id: ${commentId} not found: Model Layer returned Null`
    );
  // check if user is the owner of the comment
  if (existingComment.userId !== user.id) {
    logger.error(
      `Unauthorized: User ${user.id} is not the owner of the Comment ${commentId}`
    );
    throw new Unauthorized(
      `Unauthorized: User ${user.id} is not the owner of the Comment ${commentId}`
    );
  }
  let data = await CommentModel.CommentModel.updateComment(commentId, content);
  if (!data) {
    logger.error(`Comment not created: Model Layer returned Null`);
    throw new Internal(`Comment not created: Model Layer returned Null`);
  }
  data = await FillCommentMeta(data);
  return data;
}

// implment getCommentById
export async function getCommentById(commentId: UUID) {
  logger.info(`Getting Comment with id: ${commentId}`);
  const data = await CommentModel.CommentModel.getCommentById(commentId);

  if (!data) {
    logger.error(
      `Comment with id: ${commentId} not found: Model Layer returned Null`
    );
    throw new NotFound(
      `Comment with id: ${commentId} not found: Model Layer returned Null`
    );
  }
  return data;
}

export async function deleteComment(commentId: UUID, userInfo: IUser) {
  logger.info(`Deleting Comment with id: ${commentId}`);
  const existingComment = await CommentModel.CommentModel.getCommentById(
    commentId
  );

  if (existingComment.userId !== userInfo.id) {
    logger.error(
      `Unauthorized: User ${userInfo.id} is not the owner of the Comment ${commentId}`
    );
    throw new Unauthorized(
      `Unauthorized: User ${userInfo.id} is not the owner of the Comment ${commentId}`
    );
  }

  let data = await CommentModel.CommentModel.deleteComment(commentId);

  if (!data) {
    logger.error(`Comment not deleted: Model Layer returned Null`);
    throw new Internal(`Comment not deleted: Model Layer returned Null`);
  }
  return data;
}

async function FillCommentMeta(data) {
  await Promise.all(
    data.map(async (comment) => {
      const user = await UserModel.UserModel.getUserInfoById(comment.userId);
      comment.username = user.username;
      comment.pfpUrl = user.pfpUrl;
      let childCount = await CommentModel.CommentModel.getChildCount(
        comment.id
      );
      // console.log("\n child bount is \n", childCount);
      comment.hasChild = childCount > 0;
    })
  );
  return data;
}
