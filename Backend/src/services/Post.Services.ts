import { UUID } from "crypto";
import { NotFound } from "../error/NotFound";
import loggerWithNameSpace from "../utils/logger";
import * as PostModel from "../models/Post.Model";
import { UserModel } from "../models/User.Model";
import { IUser, Privacy } from "../interfaces/User.Interface";
import { Unauthorized } from "../error/Unauthorized";
import {
  IGetHashtagFilter,
  IGetPostPagedQuery,
} from "../interfaces/Utils.Interface";
import { IPost } from "../interfaces/Post.interface";
import { uploadStream } from "../utils/cloudinary";
import { BadRequest } from "../error/BadRequest";
import { Internal } from "../error/Internal";
const logger = loggerWithNameSpace("PostServices");

interface PostExtras {
  username: string;
  pfpUrl: string;
  mediaUrl: string[];
  liked: boolean;
  saved: boolean;
  likeCount: number;
}

export async function getPostByID(pid: UUID, requesterId: UUID) {
  let post = await PostModel.PostModel.getPostByID(pid);

  if (!post) {
    logger.error(
      `Post with id: ${pid} not found: Model Layer returned Null/undefined`
    );
    throw new NotFound(
      `Post with id: ${pid} not found: Model Layer returned Null/undefined`
    );
  }

  let owner = (await UserModel.getUserInfoById(post.userId)) as IUser;
  if (!owner) {
    logger.error(
      `User with id: ${post.userId} not found: Model Layer returned Null/undefined`
    );
    throw new NotFound(
      `User with id: ${post.userId} not found: Model Layer returned Null/undefined`
    );
  }
  if (owner.id === requesterId) {
    await FillPostData(post, requesterId);
    return post;
  }
  if (owner.privacy === Privacy.Public) {
    await FillPostData(post, requesterId);
    return post;
  }

  let isFollowing = await UserModel.getIfAFollowsB(requesterId, owner.id);
  if (isFollowing) {
    await FillPostData(post, requesterId);
    return post;
  } else throw new Unauthorized("Error: Unauthorized");
}

export async function getPublicPostsRandom(
  filter: IGetPostPagedQuery,
  requesterId: UUID
) {
  let posts = await PostModel.PostModel.getPublicPostsRandom(filter);
  if (posts) {
    await Promise.all(
      posts.map(async (post) => {
        await FillPostData(post, requesterId);
      })
    );
    return posts;
  } else throw new NotFound("Error: Found no Posts");
}

export async function getFilteredHashtags(filter: IGetHashtagFilter) {
  let tags = await PostModel.PostModel.getFilteredHashtags(filter);
  if (tags) {
    return tags;
  }
}

export async function getUserPostsPaged(
  requesterId: UUID,
  filter: IGetPostPagedQuery
) {
  let posts = await PostModel.PostModel.getUserPostsPaged(requesterId, filter);
  let user = await UserModel.getUserInfoById(requesterId);
  if (posts) {
    await Promise.all(
      posts.map(async (post) => {
        await FillPostData(post, requesterId);
      })
    );
    return posts;
  } else throw new NotFound("Error: Found no Posts");
}

export async function getFeedPosts(
  filter: IGetPostPagedQuery,
  requester: IUser
) {
  let followedList = await UserModel.getUserFollowingList(requester.id);
  let followedIds = followedList.map((item) => item.id);
  let postsList = await PostModel.PostModel.getPostList({
    ...filter,
    userIds: followedIds,
  });
  if (!postsList) throw new NotFound("Error: Found no Posts");
  await Promise.all(
    postsList.map(async (post) => {
      await FillPostData(post, requester.id);
    })
  );
  if (postsList) return postsList;
  else throw new NotFound("Error: Found no Posts");
}

export async function handlePostUpload(
  photos: Express.Multer.File[],
  requester: IUser,
  postDetails: Partial<IPost>
) {
  if (photos.length === 0) {
    throw new BadRequest("No photos found in the request");
  }

  let linkPromises: Promise<string>[] = photos.map(async (photo) => {
    let result = await uploadStream(photo.buffer, "post_media", photo.filename);
    return result.secure_url as string;
  });

  let createdPost = await PostModel.PostModel.createPost(
    postDetails,
    requester
  );

  let links: string[] = await Promise.all(linkPromises); // Wait for all the promises to resolve

  let caption = postDetails.caption;

  let tags: string[] = [];
  const regex = /#(\w+)/g;
  const matches = caption.match(regex);
  if (matches) {
    tags = matches.map((match) => match.substring(1));
  }
  let hastagsIds = [];
  //   Find if hashtags already exist in the database and add if doesn't then link post to tag
  for (const tag of tags) {
    let existingTag = await PostModel.PostModel.getHashtagByName(tag);
    if (!existingTag) {
      existingTag = await PostModel.PostModel.createHastagEntry(tag);
    }
    if (!hastagsIds.includes(existingTag.id)) {
      hastagsIds.push(existingTag.id);
      await PostModel.PostModel.addPostToHashtag(
        createdPost.id,
        existingTag.id
      );
    }
  }
  let mediaEntryIds = links.map(async (link, index) => {
    return await PostModel.PostModel.addMediaUrl(createdPost.id, link, index);
  });
  mediaEntryIds = await Promise.all(mediaEntryIds);

  if (createdPost) return { createdPost, mediaEntryIds, hastagsIds };
}

async function FillPostData(
  post: Partial<IPost & PostExtras>,
  requesterId: UUID
) {
  let user = await UserModel.getUserInfoById(post.userId);
  post.username = user.username;
  post.pfpUrl = user.pfpUrl;
  let mediaInfo = await PostModel.PostModel.getPostMedia(post.id);
  post.mediaUrl = mediaInfo.map((item) => {
    return item.mediaUrl;
  });
  post.liked = await PostModel.PostModel.getIfUserLikedPost(
    requesterId,
    post.id
  );
  post.saved = await PostModel.PostModel.getIfUserSavedPost(
    requesterId,
    post.id
  );
  post.likeCount = await PostModel.PostModel.getLikeCount(post.id);
  return post;
}

export async function updatePostCaption(pid: UUID, uid: UUID, caption: string) {
  let existingPost = await PostModel.PostModel.getPostByID(pid);

  if (!existingPost) {
    throw new NotFound("Post not found");
  }

  if (existingPost.userId !== uid) {
    throw new Unauthorized("Unauthorized to update post");
  }

  await PostModel.PostModel.unlinkPostHastags(pid);

  // now parse the caption and add the hashtags
  let tags: string[] = [];
  const regex = /#(\w+)/g;
  const matches = caption.match(regex);
  if (matches) {
    tags = matches.map((match) => match.substring(1));
  }
  let hastagsIds = [];
  //   Find if hashtags already exist in the database and add if doesn't then link post to tag
  for (const tag of tags) {
    let existingTag = await PostModel.PostModel.getHashtagByName(tag);
    if (!existingTag) {
      existingTag = await PostModel.PostModel.createHastagEntry(tag);
    }
    hastagsIds.push(existingTag.id);
    await PostModel.PostModel.addPostToHashtag(existingPost.id, existingTag.id);
  }

  // update the caption
  let updatedPost = await PostModel.PostModel.updatePostCaption(pid, caption);

  if (updatedPost) return { updatedPost: updatedPost, hastagsIds };
}

export async function deletePost(pid: UUID, uid: UUID) {
  let post = await PostModel.PostModel.getPostByID(pid);
  if (!post) {
    throw new NotFound("Post not found");
  }

  if (post.userId !== uid) {
    throw new Unauthorized("Unauthorized to delete post");
  }

  let deleteResult = await PostModel.PostModel.deletePost(pid);
  if (deleteResult) return { result: "Successfully Deleted" };
  else throw new Internal("Error: Could not delete post");
}
