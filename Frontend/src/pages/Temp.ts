// import { GridItem } from "../component/GridItem";
// import { Post } from "../component/Post";
// import { UserSummary } from "../component/UserSummary";
// import { IPost } from "../interfaces/Post.interface";
// import { IUser } from "../interfaces/User.interface";
// import { fetchView, request } from "../utils/utils";

// export class HomeFeed {
//   async load() {
//     if (
//       !window.history.state ||
//       window.history.state.currentView != "homeView"
//     ) {
//       let view = await fetchView("/views/Home.html");
//       document.getElementById("app")!.innerHTML = view;
//       window.history.replaceState(
//         { ...window.history.state, currentView: "homeView" },
//         "",
//       );
//     }
//     if (window.history.state.currentTab != "homeFeed") {
//       document.getElementById("mainContainer")!.innerHTML = "";
//       window.history.replaceState(
//         { ...window.history.state, currentTab: "homeFeed" },
//         "",
//       );
//     }
//     window.history.replaceState(
//       { ...window.history.state, currentTab: "homeFeed" },
//       "",
//     );
//     // if (!localStorage.getItem("userInfo")) {
//     //   let userData = await request(
//     //     { url: import.meta.env.VITE_BACKEND_URL + "/user", method: "GET" },
//     //     false,
//     //   );
//     //   console.log(userData);
//     //   // Code to execute if userInfo object is present in localstorage
//     // }

//     const icons = document.querySelectorAll("[nav-icon]");
//     icons.forEach((icon) => {
//       icon.classList.remove("active");
//     });
//     const homeIcon = document.querySelector(
//       '[data-nav-icon="home"]',
//     ) as HTMLImageElement;
//     homeIcon?.classList.add("active");
//     homeIcon.setAttribute("src", "/assets/icons/home-active.svg");
//     this.setup();

//     let postData: IPost = {
//       username: "aka.Mark",
//       pfpUrl:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-y-fFn8KjGMJWwHyFA32_Xvysu-c0c3pHIw&s",
//       caption:
//         "This is a test post that hopefully works in the frontend, because I'm tired of debugging and I want to see some results",
//       id: "something",
//       mediaUrl: [
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-y-fFn8KjGMJWwHyFA32_Xvysu-c0c3pHIw&s",
//       ],
//       likeCount: 50,
//       createdAt: new Date(),
//     };
//     Post.createAndAppend(postData, document.getElementById("mainContainer")!);
//     // await Post.create(postData);
//     // postData.caption = " short caption";
//     // await Post.create(postData);
//     // document.getElementById("insertFeed")!.innerHTML = await fetchView(
//     //   "/component/Profile.html",
//     // );
//     let user: Partial<IUser> = {
//       username: "aka.Mark",
//       name: "Mark Manson",
//       pfpUrl:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-y-fFn8KjGMJWwHyFA32_Xvysu-c0c3pHIw&s",
//     };
//     // GridItem.create(postData, document.getElementById("gridContainer")!);
//     // GridItem.create(postData, document.getElementById("gridContainer")!);
//     // GridItem.create(postData, document.getElementById("gridContainer")!);
//     // GridItem.create(postData, document.getElementById("gridContainer")!);
//     // UserSummary.create(user, document.getElementById("searchResults")!);
//     // document.getElementById("insertFeed")!.innerHTML =
//     //   // (await fetchView("/component/PostModal.html")) +
//     //   (await fetchView("/component/Post.html")) +
//     //   (await fetchView("/component/Post.html"));
//     // let elem = document.querySelector("#profilePosts") as HTMLElement;
//     // elem.innerHTML = await fetchView("/component/Gridbase.html");
//     // elem = document.querySelector("#gridContainer") as HTMLElement;
//     // GridItem.create(postData, elem);
//     // GridItem.create(postData, elem);
//     // GridItem.create(postData, elem);
//     // GridItem.create(postData, elem);
//     // GridItem.create(postData, elem);
//     // GridItem.create(postData, elem);
//   }

//   setup() {
//     document.getElementById("homeIcon");
//     console.log("setup about");
//   }
// }
