import { GridItem } from "../component/GridItem";
import { IPost } from "../interfaces/Post.interface";
import { fetchView, getCookie, request, updateNavbar } from "../utils/utils";

export class Explore {
  async load(tag: string = "") {
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
    // if (window.history.state.currentTab != "search") {
    //   document.getElementById("mainContainer")!.innerHTML = "";
    //   window.history.replaceState(
    //     { ...window.history.state, currentTab: "search" },
    //     "",
    //   );
    // }
    console.log(tag);
    const mainContainer = document.getElementById(
      "mainContainer",
    ) as HTMLElement;
    mainContainer.innerHTML = "";

    window.history.replaceState(
      { ...window.history.state, currentTab: "explore" },
      "",
    );

    let view = await fetchView("/component/Gridbase.html");
    mainContainer.innerHTML = view;
    if (tag) {
      let heading = document.createElement("h1");
      heading.setAttribute("class", "text-2xl font-bold");
      heading.innerText = `#${tag}`;
      mainContainer.prepend(heading);
    }
    updateNavbar("explore");

    this.setup(mainContainer, tag);
  }

  async setup(mainContainer: HTMLElement, tag: string = "") {
    const gridContainer = document.getElementById(
      "gridContainer",
    ) as HTMLDivElement;
    const backendRes = await request({
      url:
        import.meta.env.VITE_BACKEND_URL +
        `/posts/explore?${tag ? "tag=" + tag + "&" : ""}page=1&size=20`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (backendRes.status != "success") {
      console.log("Error fetching posts");
      showError(mainContainer);
      return;
    }
    const postList: Partial<IPost>[] = backendRes.payload;
    postList.forEach((post: Partial<IPost>) => {
      GridItem.create(post, gridContainer);
    });
    if (postList.length == 0) {
      let noPost = document.createElement("h1");
      noPost.setAttribute("class", "text-2xl font-bold text-center");
      noPost.innerText = `No posts found at this time ${tag ? `for #${tag}` : ""}`;
      mainContainer.innerHTML = "";
      mainContainer.appendChild(noPost);
    }
  }
}

function showError(container: HTMLElement) {
  let noPost = document.createElement("h1");
  noPost.setAttribute("class", "text-2xl font-bold text-center");
  noPost.innerText = "Could not Fetch Post at this time";
  container.innerHTML = "";
  container.appendChild(noPost);
  return;
}
