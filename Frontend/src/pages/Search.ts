import { GridItem } from "../component/GridItem";
import { Hashtag } from "../component/Hashtag";
import { Post } from "../component/Post";
import { UserSummary } from "../component/UserSummary";
import { IPost } from "../interfaces/Post.interface";
import { FollowStatus, IUser } from "../interfaces/User.interface";
import { fetchView, request, updateNavbar } from "../utils/utils";

export class Search {
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
    if (window.history.state.currentTab != "search") {
      document.getElementById("mainContainer")!.innerHTML = "";
      window.history.replaceState(
        { ...window.history.state, currentTab: "search" },
        "",
      );
    }
    const mainContainer = document.getElementById(
      "mainContainer",
    ) as HTMLElement;
    mainContainer.innerHTML = "";
    window.history.replaceState(
      { ...window.history.state, currentTab: "search" },
      "",
    );

    let view = await fetchView("/component/Search.html");
    mainContainer.innerHTML = view;
    await updateNavbar("search");

    this.setup();
  }

  setup() {
    const inputField = document.getElementById(
      "searchInput",
    ) as HTMLInputElement;
    const resultContainer = document.getElementById(
      "searchResults",
    ) as HTMLDivElement;
    inputField.addEventListener("input", async () => {
      const type = (document.getElementById("searchType") as HTMLSelectElement)
        .value;
      if (type == "username") getUsers(inputField.value, resultContainer);
      else if (type == "tag") getHastags(inputField.value, resultContainer);

      console.log("setup about");
    });
  }
}

async function getUsers(inputVal: string, resultContainer: HTMLElement) {
  let res = await request({
    url: import.meta.env.VITE_BACKEND_URL + `/user/?q=${inputVal}&size=20`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status != "success") {
    console.log("Error fetching users");
    return;
  }
  resultContainer.innerHTML = "";
  let users: Partial<IUser>[] = res.payload.data;
  users.forEach((user) => {
    UserSummary.create(user, resultContainer);
  });
}
async function getHastags(inputVal: string, resultContainer: HTMLElement) {
  console.log("getHastags");
  let res = await request({
    url:
      import.meta.env.VITE_BACKEND_URL + `/api/hastags/?q=${inputVal}&size=20`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status != "success") {
    console.log("Error fetching tags");
    return;
  }
  console.log(res.payload);
  resultContainer.innerHTML = "";
  let tags: any[] = res.payload;
  tags.forEach((tag) => {
    Hashtag.create(tag.name, resultContainer);
  });
}
