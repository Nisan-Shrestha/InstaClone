// import { fetchView } from "../utils/utils";

import { IComment } from "../interfaces/Comment.interface";
import { IPost } from "../interfaces/Post.interface";
import { router } from "../main";
import { fetchView, getCookie, request } from "../utils/utils";

export class Comment {
  public static async createAndAppend(
    commentDetails: Partial<IComment>,
    parentDiv: HTMLElement,
  ) {
    if (!commentDetails.content) return;
    let newComment = await fetchView("/component/Comment.html");
    let container = document.createElement("div");
    container.setAttribute("class", "pt-1 mb-2");
    container.innerHTML = newComment;

    parentDiv?.appendChild(container);

    let imgTag = container.querySelector("img[data-pfp]") as HTMLImageElement;
    if (commentDetails.pfpUrl)
      imgTag.setAttribute("src", commentDetails.pfpUrl);

    let usernameSpans = container.querySelectorAll("[data-username]");
    usernameSpans.forEach(
      (elem) => (elem.innerHTML = commentDetails.username!),
    );

    const caption = container.querySelector(
      "[data-comment-content]",
    ) as HTMLElement;

    caption.innerText = commentDetails.content;
    container.setAttribute("data-comment-container-id", commentDetails.id!);
    // console.log("create:", container);
    this.setup(commentDetails, container);
  }

  static setup(commentDetails: Partial<IComment>, container: HTMLElement) {
    container.querySelectorAll("a[data-pfp-wrapper]")?.forEach((e) => {
      e.setAttribute("href", `/u/${commentDetails.username}`);
      e.addEventListener("click", (event) => {
        event.preventDefault();
      });
    });
    const replyBtn = container.querySelector(
      "[data-reply-button]",
    ) as HTMLButtonElement;
    replyBtn.setAttribute("data-comment-id", commentDetails.id!);
    replyBtn.addEventListener("click", () => enableReply(commentDetails));

    const editBtn = container.querySelector(
      "[data-edit-button]",
    ) as HTMLButtonElement;
    if (commentDetails.username !== getCookie("username")) {
      editBtn.remove();
    } else {
      editBtn.setAttribute("data-comment-id", commentDetails.id!);
      editBtn.addEventListener("click", () => enableEdit(commentDetails));
    }
    const viewReplyBtn = container.querySelector(
      "[data-viewReply-button]",
    ) as HTMLButtonElement;
    // console.log(commentDetails);
    if (!commentDetails.hasChild) {
      viewReplyBtn.remove();
    } else {
      viewReplyBtn.setAttribute("data-comment-id", commentDetails.id!);
      viewReplyBtn.addEventListener(
        "click",
        () =>
          enableViewMore(
            commentDetails,
            container as HTMLDivElement,
            viewReplyBtn,
          ),
        { once: true },
      );
    }
    if (commentDetails.parentId) {
      replyBtn.classList.add("hidden");
      container.classList.add("pl-4");
    }
  }
}

function enableReply(commentDetails: Partial<IComment>) {
  document.getElementById("commentInput")?.focus();
  document
    .getElementById("commentButton")
    ?.setAttribute("data-selected-commentId", commentDetails.id!);

  document.getElementById("commentButton")?.setAttribute("data-type", "reply");
  document.getElementById("editStatus")?.classList.remove("hidden");
  document.getElementById("editStatusVal")!.innerText =
    `Replying to ${commentDetails.username}`;
  document.getElementById("resetBtn")!.addEventListener(
    "click",
    () => {
      resetCommentInputType();
    },
    { once: true },
  );
}

function enableEdit(commentDetails: Partial<IComment>) {
  (document.getElementById("commentInput") as HTMLTextAreaElement).value =
    commentDetails.content!;
  document
    .getElementById("commentButton")
    ?.setAttribute("data-selected-commentId", commentDetails.id!);

  document.getElementById("commentButton")?.setAttribute("data-type", "edit");
  document.getElementById("editStatus")?.classList.remove("hidden");
  document.getElementById("editStatusVal")!.innerText = `Editing comment`;
  document.getElementById("resetBtn")!.addEventListener(
    "click",
    () => {
      resetCommentInputType();
    },
    { once: true },
  );
}

async function enableViewMore(
  commentDetails: Partial<IComment>,
  container: HTMLDivElement,
  viewReplyBtn: HTMLButtonElement,
) {
  const commentId = commentDetails.id;

  let commentsRes = await request(
    {
      url: import.meta.env.VITE_BACKEND_URL + `/comments/childof/${commentId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: { username: postDetails.username, postId: postDetails.id },
    },
    true,
  );
  const comments = commentsRes.payload as IComment[];
  let children = container.children;
  for (let i = 2; i < children.length; i++) {
    children[i].remove();
  }
  comments.forEach((comment) => {
    Comment.createAndAppend(comment, container);
  });
  viewReplyBtn.remove();
}

export function resetCommentInputType() {
  (document.getElementById("commentInput") as HTMLTextAreaElement).value = "";
  document
    .getElementById("commentButton")
    ?.setAttribute("data-selected-commentId", "");
  document.getElementById("editStatus")?.classList.add("hidden");
  document.getElementById("commentButton")?.setAttribute("data-type", "new");
}
