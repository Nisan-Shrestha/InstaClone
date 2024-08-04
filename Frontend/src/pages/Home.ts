import { Post } from "../component/Post";
import { IPost } from "../interfaces/Post.interface";
import { fetchView, request, updateNavbar } from "../utils/utils";

export class HomeFeed {
  async load() {
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
    if (window.history.state.currentTab != "homeFeed") {
      document.getElementById("mainContainer")!.innerHTML = "";
      window.history.replaceState(
        { ...window.history.state, currentTab: "homeFeed" },
        "",
      );
    }
    window.history.replaceState(
      { ...window.history.state, currentTab: "homeFeed" },
      "",
    );
    await updateNavbar("home");

    this.setup();
  }

  async setup() {
    // Post.createAndAppend(postData, document.getElementById("mainContainer")!);
    let posts = (
      await request({
        url: import.meta.env.VITE_BACKEND_URL + "/posts/feed",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).payload;
    // console.log(posts[1]);
    posts.forEach((post: Partial<IPost>) => {
      console.log(post);
      Post.createAndAppend(post, document.getElementById("mainContainer")!);
    });
    document.getElementById("homeIcon");
    console.log("setup about");
  }
}
