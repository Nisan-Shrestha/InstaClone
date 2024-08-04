import { FollowStatus, IUser } from "../interfaces/User.interface";
import { router } from "../main";
import { Profile } from "../pages/Profile";

export async function fetchView(url: string): Promise<string> {
  const response = await fetch(url);
  let text = await response.text();
  console.log("fetched " + url, "\n");
  return text;
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export async function request(
  Params: {
    url: string;
    method: string;

    headers?: object;
    body?: object;
    other?: { contentType: string };
  } = { url: "", method: "GET" },
  allowUnauthorized: boolean = false,
): Promise<{ status: string; message: string; payload: any }> {
  if (!allowUnauthorized) {
    if (getCookie("refreshTokenValid") == "false") {
      router.navigate("/login");
      return {
        status: "redirected",
        message: "Redirected to Login",
        payload: {},
      };
    }

    if (getCookie("accessTokenValid") == "false") {
      await request(
        {
          url: import.meta.env.VITE_BACKEND_URL + "/auth/refresh",
          method: "GET",
        },
        (allowUnauthorized = true),
      );
    }
  }
  let body;
  if (Params.method == "GET") body = null;
  else if (Params.other?.contentType == "multipart/form-data")
    body = Params.body;
  else body = JSON.stringify(Params.body);
  console.log(body, Params.body);
  let header = new Headers({ ...Params.headers });
  const response = await fetch(Params.url, {
    method: Params.method,
    body: body as BodyInit,
    headers: header,
    ...Params.other,
    credentials: "include",
  });

  const status = response.status;

  if (status >= 200 && status < 300) {
    const data = await response.json();
    const { message, payload } = data;
    return { status: "success", message, payload };
  } else if (status >= 300 && status < 400) {
    const data = await response.json();
    router.navigate(data.payload.redirectTo);
    return { status: "redirected", message: "Redirected", payload: {} };
  } else if (status >= 400) {
    const data = await response.json();
    const { message, payload } = data;
    return { status: "error", message, payload };
  } else {
    return { status: "error", message: "Error Occured", payload: {} };
  }
  // } catch (err) {
  //   console.error(err);
  //   return { status: "error", message: "Error Occured", payload: err };
  // }
}

export async function updateNavbar(tab: string) {
  const icons = document.querySelectorAll("[data-nav-icon]");
  icons.forEach((icon) => {
    icon.classList.remove("active");
    let iconName = icon.getAttribute("data-nav-icon");
    icon.setAttribute("src", `/assets/icons/${iconName}.svg`);
  });
  const activeIcon = document.querySelector(
    `[data-nav-icon="${tab}"]`,
  ) as HTMLImageElement;
  activeIcon?.classList.add("active");
  activeIcon.setAttribute("src", `/assets/icons/${tab}-active.svg`);
  let profileAnchor = document.querySelector(
    "[data-profile-link]",
  ) as HTMLAnchorElement;
  profileAnchor.setAttribute("href", "/u/" + getCookie("username"));
  let profImg = profileAnchor.querySelector(
    "img[data-nav-icon]",
  ) as HTMLImageElement;
  let url = decodeURIComponent(getCookie("pfpUrl") as string);
  console.log(url);
  if (url == "empty") url = "/assets/icons/profile.svg";
  profImg.setAttribute("src", url);

  let usernamePrompt = getCookie("promptUsernameChange");
  if (usernamePrompt == "true") {
    console.log("asjndkansd");
    let usernameComponent = document.createElement("div") as HTMLDivElement;
    usernameComponent.innerHTML = await fetchView(
      "/component/UsernameForm.html",
    );
    let app = document.querySelector("#app") as HTMLDivElement;
    app.append(usernameComponent);

    const username = document.getElementById(
      "edit-username-login",
    ) as HTMLInputElement;
    username?.addEventListener("input", async () => {
      username.value.toLowerCase();
      // valdiate username
      // if no error
      let errorSpan = document.getElementById(
        "usernameError",
      ) as HTMLSpanElement;
      if (username.value == getCookie("username")) {
        errorSpan.classList.add("hidden");
        return;
      }
      if (await Profile.checkUsernameFree(username.value, errorSpan))
        document.getElementById("submitEdit")?.classList.remove("disabled");
      else document.getElementById("submitEdit")?.classList.add("disabled");
    });

    let submitBtn = document.getElementById("submitEdit") as HTMLButtonElement;
    submitBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      let res = await request({
        url: import.meta.env.VITE_BACKEND_URL + "/user/username",
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: { username: username.value },
      });
      if (res.status == "success") {
        usernameComponent.remove();
      } else {
        alert("Error changing username, please try again");
      }
    });
  }
}

export async function follow(
  userDetails: Partial<IUser>,
  followBtn: HTMLButtonElement,
) {
  let response = await request({
    url:
      import.meta.env.VITE_BACKEND_URL + `/api/follow/${userDetails.username}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status !== "success") {
    // TODO:
    console.log("Error following user");
    return;
  }
  followBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
  followBtn.classList.add("bg-red-600", "hover:bg-red-700");

  if (response.payload.followResult == "requested") {
    followBtn.innerText = "Remove Request";
  } else if (response.payload.followResult == "followed") {
    followBtn.innerText = "Unfollow";
  }
  followBtn.addEventListener(
    "click",
    async () => unfollow(userDetails, followBtn),
    { once: true },
  );

  // router.navigate(`/u/${userDetails.username}`, window.history.state);
}

export async function unfollow(
  userDetails: Partial<IUser>,
  followBtn: HTMLButtonElement,
) {
  let response = await request({
    url:
      import.meta.env.VITE_BACKEND_URL +
      `/api/unfollow/${userDetails.username}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status !== "success") {
    console.log("Error following user");
    return;
  }
  followBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
  followBtn.classList.remove("bg-red-600", "hover:bg-red-700");
  followBtn.innerText = "Follow";
  followBtn.addEventListener(
    "click",
    async () => follow(userDetails, followBtn),
    { once: true },
  );
  // router.navigate(`/u/${userDetails.username}`, window.history.state);
}

export function setupFollowBtn(
  userDetails: Partial<IUser>,
  container: HTMLElement,
) {
  let followBtn = container.querySelector(
    "button[data-follow-btn]",
  ) as HTMLButtonElement;
  if (userDetails.username == getCookie("username")) {
    followBtn.style.display = "none";
    return;
  }
  console.log(userDetails.following);
  if (userDetails.following == FollowStatus.Notfollowing) {
    followBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
    followBtn.classList.remove("bg-red-600", "hover:bg-red-700");
    followBtn.innerText = "Follow";
    followBtn.addEventListener(
      "click",
      async () => follow(userDetails, followBtn),
      { once: true },
    );
  } else {
    followBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
    followBtn.classList.add("bg-red-600", "hover:bg-red-700");
    if (userDetails.following == FollowStatus.Following)
      followBtn.innerText = "Unfollow";
    else if (userDetails.following == FollowStatus.Pending)
      followBtn.innerText = "Remove Request";

    followBtn.addEventListener(
      "click",
      async () => unfollow(userDetails, followBtn),
      { once: true },
    );
  }
}
