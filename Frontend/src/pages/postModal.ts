// import { fetchView } from "../utils/utils";

import { Comment, resetCommentInputType } from "../component/Comment";
import { IComment } from "../interfaces/Comment.interface";
import { IPost } from "../interfaces/Post.interface";
import { router } from "../main";
import { fetchView, request } from "../utils/utils";

export class PostModal {
  public static async load(postId: string) {
    if (
      !window.history.state ||
      window.history.state.currentView != "homeView"
    ) {
      let view = await fetchView("/views/Home.html");
      document.getElementById("app")!.innerHTML = view;
      window.history.replaceState(
        { ...window.history.state, currentView: "homeView" },
        "",
      );
    }
    // if (window.history.state.currentTab != "homeFeed") {
    //   document.getElementById("mainContainer")!.innerHTML = "";
    //   window.history.replaceState(
    //     { ...window.history.state, currentTab: "homeFeed" },
    //     "",
    //   );
    // }
    // window.history.replaceState(
    //   { ...window.history.state, currentTab: "homeFeed" },
    //   "",
    // );

    let newPost = await fetchView("/component/PostModal.html");
    let container = document.createElement("div");
    container.setAttribute("class", "w-6/12 max-w-xl min-w-64");
    container.innerHTML = newPost;
    // return;
    const FeedContainer = document.getElementById("mainContainer");
    FeedContainer?.appendChild(container);

    let postDetails = (
      await request({
        url: import.meta.env.VITE_BACKEND_URL + `/posts/${postId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).payload;
    if (!postDetails) {
      router.navigate("/", window.history.state);
      return;
    }
    console.log("postDetails:", postDetails);
    let imgTag = container.querySelector("img[data-pfp]") as HTMLImageElement;
    if (postDetails.pfpUrl) imgTag.setAttribute("src", postDetails.pfpUrl);

    let usernameSpans = container.querySelectorAll("[data-username]");
    usernameSpans.forEach((elem) => (elem.innerHTML = postDetails.username!));

    const mediaElement = container.querySelector(
      "[data-post-media]",
    ) as HTMLImageElement;

    // TODO: convert to carousel
    if (postDetails.mediaUrl && postDetails.mediaUrl.length > 0) {
      mediaElement.setAttribute("src", postDetails.mediaUrl[0]);
    }

    const likeCount = container.querySelector(
      "[data-like-count]",
    ) as HTMLElement;
    if (postDetails.likeCount)
      likeCount.innerHTML = postDetails.likeCount.toString();

    const caption = container.querySelector("[data-caption]") as HTMLElement;

    caption.innerText = postDetails.caption || "";

    const regex = /#(\w+)/g;
    const matches = caption.innerText.match(regex);

    if (matches) {
      matches.forEach((match) => {
        const anchor = document.createElement("a") as HTMLAnchorElement;
        anchor.innerText = match;
        anchor.setAttribute("href", `/explore/${match.slice(1)}`);
        anchor.setAttribute("data-link", "");
        anchor.classList.add("text-blue-600");
        caption.innerHTML = caption.innerHTML.replace(match, anchor.outerHTML);
      });
    }
    this.setup(postDetails, container);
  }

  static async setup(postDetails: Partial<IPost>, container: HTMLElement) {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key == "Escape") {
          if (!window.history.state.currentTab)
            router.navigate("/", window.history.state);
          else window.history.back();
        }
      },
      { once: true },
    );
    container.querySelector("[data-close-modal]")?.addEventListener(
      "click",
      (event) => {
        console.log("close");
        if (!window.history.state.currentTab)
          router.navigate("/", window.history.state);
        else window.history.back();
      },
      { once: true },
    );

    container.querySelectorAll("a[data-pfp-wrapper]")?.forEach((e) => {
      e.setAttribute("href", `/u/${postDetails.username}`);
      e.addEventListener("click", (event) => {
        event.preventDefault();
      });
    });

   
    const delBtn = container.querySelector(
      "[data-delete-post]",
    ) as HTMLButtonElement;
    if (postDetails.username !== localStorage.getItem("username")) {
      delBtn.remove();
    }
    delBtn.addEventListener("click", async () => {
      if (confirm("Are you sure to delete this post?")) {
        alert("Thanks for confirming");
        let res = await request(
          {
            url: import.meta.env.VITE_BACKEND_URL + `/posts/${postDetails.id}/`,
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
          true,
        );
        if (res.status == "success") {
          container.remove();
          window.history.back();
        }
      } else {
        alert("Why did you press cancel? You should have confirmed");
      }
    });

    const likeBtn = container.querySelector(
      "[data-like-button]",
    ) as HTMLButtonElement;

    likeBtn.addEventListener("click", async () => {
      if (likeBtn.getAttribute("data-liked") == "false") {
        likeBtn.setAttribute("data-liked", "true");
        if (!postDetails.likeCount) postDetails.likeCount = 0;
        postDetails.likeCount++;
        const likeCount = container.querySelector(
          "[data-like-count]",
        ) as HTMLElement;
        likeCount.innerHTML = postDetails.likeCount.toString();
        likeBtn
          .querySelector("img")
          ?.setAttribute("src", "/assets/icons/like-active.svg");

        request(
          {
            url:
              import.meta.env.VITE_BACKEND_URL + `/api/${postDetails.id}/like`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // body: { username: postDetails.username, postId: postDetails.id },
          },
          true,
        );
      } else {
        likeBtn.setAttribute("data-liked", "false");
        if (!postDetails.likeCount) postDetails.likeCount = 1;
        postDetails.likeCount--;
        const likeCount = container.querySelector(
          "[data-like-count]",
        ) as HTMLElement;
        likeCount.innerHTML = postDetails.likeCount.toString();
        likeBtn
          .querySelector("img")
          ?.setAttribute("src", "/assets/icons/like.svg");
        let res = await request(
          {
            url:
              import.meta.env.VITE_BACKEND_URL +
              `/api/${postDetails.id}/unlike`,
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: { username: postDetails.username, postId: postDetails.id },
          },
          true,
        );
        console.log("res:", res);
      }
    });

    container
      .querySelector("[data-share-button]")
      ?.addEventListener("click", () => {
        navigator.clipboard.writeText(
          `${window.location.origin}/p/${postDetails.id}`,
        );
      });

    const saveBtn = container.querySelector(
      "[data-save-button]",
    ) as HTMLButtonElement;

    saveBtn.addEventListener("click", async () => {
      if (saveBtn.getAttribute("data-saved") == "false") {
        saveBtn.setAttribute("data-saved", "true");

        saveBtn
          .querySelector("img")
          ?.setAttribute("src", "/assets/icons/save-active.svg");

        request(
          {
            url:
              import.meta.env.VITE_BACKEND_URL + `/api/${postDetails.id}/save`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: { username: postDetails.username, postId: postDetails.id },
          },
          true,
        );
      } else {
        saveBtn.setAttribute("data-saved", "false");

        saveBtn
          .querySelector("img")
          ?.setAttribute("src", "/assets/icons/save.svg");
        request(
          {
            url:
              import.meta.env.VITE_BACKEND_URL +
              `/api/${postDetails.id}/unsave`,
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: { username: postDetails.username, postId: postDetails.id },
          },
          true,
        );
      }
    });
    console.log(postDetails.saved);
    if (postDetails.saved) {
      saveBtn
        .querySelector("img")
        ?.setAttribute("src", "/assets/icons/save-active.svg");
      saveBtn.setAttribute("data-saved", "true");
    }
    if (postDetails.liked) {
      likeBtn
        .querySelector("img")
        ?.setAttribute("src", "/assets/icons/like-active.svg");
      likeBtn.setAttribute("data-liked", "true");
    }

    const commentHolder = container.querySelector(
      "[data-comment-holder]",
    ) as HTMLDivElement;

    // let comment: IComment = {
    //   id: "abc",
    //   username: "akaMark",
    //   pfpUrl:
    //     "https://res.cloudinary.com/dubczuwos/image/upload/v1722442853/post_media/yhshiwsgvuruwdbpt3bo.png",
    //   content:
    //     "This is comment assjhad bsbdkash kdjabjsd kasd hajsdiabs absid dipushdh iuausb iuqaqashd iuhwi",
    //   createdAt: new Date(),
    // };

    let commentsRes = await request(
      {
        url:
          import.meta.env.VITE_BACKEND_URL +
          `/comments/allparent/${postDetails.id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: { username: postDetails.username, postId: postDetails.id },
      },
      true,
    );
    const comments = commentsRes.payload as IComment[];
    comments.forEach((comment) => {
      console.log(comment);
      Comment.createAndAppend(comment, commentHolder);
    });

    const commentInput = container.querySelector(
      "#commentInput",
    ) as HTMLTextAreaElement;

    const commentBtn = container.querySelector(
      "#commentButton",
    ) as HTMLTextAreaElement;

    commentBtn.addEventListener("click", async () => {
      console.log(
        "commentBtn.getAttribute('data-type'):",
        commentBtn.getAttribute("data-type"),
      );
      if (commentBtn.getAttribute("data-type") == "new") {
        this.addComment(postDetails, commentInput.value, commentHolder);
      } else if (commentBtn.getAttribute("data-type") == "edit") {
        this.editComment(
          postDetails,
          commentInput.value,
          commentBtn.getAttribute("data-selected-commentid")!,
        );
      } else if (commentBtn.getAttribute("data-type") == "reply") {
        this.replyComment(
          postDetails,
          commentInput.value,
          commentBtn.getAttribute("data-selected-commentid")!,
        );
      }

      // console.log("sent to", reqUrl, "res:", res);

      // container.querySelector("[data-close-modal]")?.addEventListener("click", () => {
    });
  }

  static async addComment(
    postDetails: Partial<IPost>,
    content: string,
    commentHolder: HTMLDivElement,
  ) {
    let res = await request(
      {
        url: import.meta.env.VITE_BACKEND_URL + `/comments/${postDetails.id}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { content, postId: postDetails.id },
      },
      true,
    );

    if (res.status != "success") return;
    Comment.createAndAppend(res.payload, commentHolder);
    resetCommentInputType();
  }

  static async editComment(
    postDetails: Partial<IPost>,
    content: string,
    commentId: string,
  ) {
    let res = await request(
      {
        url: import.meta.env.VITE_BACKEND_URL + "/comments/" + commentId,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: { content, postId: postDetails.id },
      },
      true,
    );
    if (res.status != "success") return;
    console.log(res.payload);
    document.querySelector(
      `[data-comment-container-id="${commentId}"] span[data-comment-content]`,
    )!.textContent = res.payload[0].content;
    resetCommentInputType();
  }

  static async replyComment(
    postDetails: Partial<IPost>,
    content: string,
    commentId: string,
  ) {
    let res = await request(
      {
        url: import.meta.env.VITE_BACKEND_URL + `/comments/${postDetails.id}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { content, postId: postDetails.id, parentId: commentId },
      },
      true,
    );
    if (res.status != "success") return;
    // console.log("payload", res.payload);
    // document.querySelector(`[data-comment-id="${commentId}"]`)!.textContent =
    // res.payload[0].content;
    const orginalComment = document.querySelector(
      `[data-comment-container-id="${commentId}"]`,
    );
    Comment.createAndAppend(res.payload[0], orginalComment as HTMLDivElement);
    console.log(orginalComment);

    resetCommentInputType();
  }
}
