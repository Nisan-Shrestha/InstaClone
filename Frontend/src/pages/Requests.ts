import { Hashtag } from "../component/Hashtag";
import { RequestSummary } from "../component/RequestSummary";
import { UserSummary } from "../component/UserSummary";
import { IUser } from "../interfaces/User.interface";
import { fetchView, request, updateNavbar } from "../utils/utils";

export class RequestPage {
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
    if (window.history.state.currentTab != "requests") {
      document.getElementById("mainContainer")!.innerHTML = "";
      window.history.replaceState(
        { ...window.history.state, currentTab: "requests" },
        "",
      );
    }
    await updateNavbar("like");
    const mainContainer = document.getElementById(
      "mainContainer",
    ) as HTMLElement;
    mainContainer.innerHTML = "";

    let container = document.createElement("div") as HTMLDivElement;
    container.setAttribute(
      "class",
      "mt-8 flex w-full flex-col items-start bg-slate-100 md:w-1/2",
    );
    mainContainer.appendChild(container);
    this.setup(container);
  }

  async setup(container: HTMLDivElement) {
    let res = await request({
      url: import.meta.env.VITE_BACKEND_URL + `/api/follow-requests`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status != "success") {
      setTimeout(async () => {
        await this.setup(container);
      }, 2000);
      console.log("Error fetching users");
      return;
    }
    container.innerHTML = "";
    let users: Partial<IUser>[] = res.payload;
    if (users.length == 0 || !users) {
      container.innerHTML =
        "<div class=' text-3xl text-center w-full'> No Pending requests </div>";
      return;
    }
    users.forEach((user) => {
      RequestSummary.create(user, container);
    });
  }
}
