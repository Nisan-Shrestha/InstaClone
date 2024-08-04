// import { fetchView } from "../utils/utils";

import { IPost } from "../interfaces/Post.interface";
import { router } from "../main";
import { fetchView, getCookie, request } from "../utils/utils";

export class Post {
  public static async createAndAppend(
    postDetails: Partial<IPost>,
    parentDiv: HTMLElement,
  ) {
    if (!postDetails.mediaUrl) {
      router.navigate("/", window.history.state);
      return;
    }
    let newPost = await fetchView("/component/Post.html");
    let container = document.createElement("div");
    container.setAttribute("class", "w-6/12 max-w-xl min-w-64");
    container.innerHTML = newPost;

    parentDiv?.appendChild(container);

    let imgTag = container.querySelector("img[data-pfp]") as HTMLImageElement;
    if (postDetails.pfpUrl) imgTag.setAttribute("src", postDetails.pfpUrl);

    let usernameSpans = container.querySelectorAll("[data-username]");
    usernameSpans.forEach((elem) => (elem.innerHTML = postDetails.username!));

    const mediaElement = container.querySelector(
      "[data-post-media]",
    ) as HTMLImageElement;

    let current = 0;
    if (postDetails.mediaUrl && postDetails.mediaUrl.length > 0) {
      mediaElement.setAttribute("src", postDetails.mediaUrl[current]);
    }

    let rightBtn = container.querySelector(
      "[data-right-arrow]",
    ) as HTMLImageElement;
    let leftBtn = container.querySelector(
      "[data-left-arrow]",
    ) as HTMLImageElement;

    if (postDetails.mediaUrl.length == 1) {
      rightBtn.remove();
      leftBtn.remove();
    } else {
      rightBtn.addEventListener("click", () => {
        current++;
        current %= postDetails.mediaUrl!.length;
        mediaElement.setAttribute("src", postDetails.mediaUrl![current]);
      });
      leftBtn.addEventListener("click", () => {
        current--;
        current = current < 0 ? postDetails.mediaUrl!.length - 1 : current;
        mediaElement.setAttribute("src", postDetails.mediaUrl![current]);
      });
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

  static setup(postDetails: Partial<IPost>, container: HTMLElement) {
    container.querySelectorAll("a[data-pfp-wrapper]")?.forEach((e) => {
      e.setAttribute("href", `/u/${postDetails.username}`);
      e.addEventListener("click", (event) => {
        event.preventDefault();
      });
    });

    const delBtn = container.querySelector(
      "[data-delete-post]",
    ) as HTMLButtonElement;
    if (postDetails.username !== getCookie("username")) {
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
        if (res.status == "success") container.remove();
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

    let commentBtn = container.querySelector("[data-comment-button]");
    commentBtn?.addEventListener("click", () => {
      // document.getElementById("insertFeed")!.innerHTML+=
      // (await fetchView("/component/PostModal.html"))
      router.navigate(`/p/${postDetails.id}`, window.history.state);
    });

    container
      .querySelector("[data-share-button]")
      ?.addEventListener("click", () => {
        navigator.clipboard.writeText(
          `${window.location.origin}/p/${postDetails.id}`,
        );
        alert(
          "Post Share link copied to clipboard: \n" +
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

    let viewCmtBtn = container.querySelector("[data-view-comment-button]");
    viewCmtBtn?.addEventListener("click", () => {
      // document.getElementById("insertFeed")!.innerHTML+=
      // (await fetchView("/component/PostModal.html"))
      router.navigate(`/p/${postDetails.id}`, window.history.state);
    });
  }
}
