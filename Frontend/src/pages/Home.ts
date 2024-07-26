// import { fetchView } from "../utils/utils";

import { fetchView, request } from "../utils/utils";

export class Home {
  async load() {
    if (
      !window.history.state ||
      window.history.state.currentView != "homeView"
    ) {
      let data = await fetchView("/views/Home.html");
      document.getElementById("app")!.innerHTML = data;
      window.history.replaceState(
        { ...window.history.state, currentView: "home" },
        "",
      );
    }
    if (!localStorage.getItem("userInfo")) {
      let userData = await request(
        { url: import.meta.env.VITE_BACKEND_URL + "/user", method: "GET" },
        false,
      );
      console.log(userData);
      // Code to execute if userInfo object is present in localstorage
    }
    this.setup();
  }

  setup() {
    console.log("setup about");
  }
}
