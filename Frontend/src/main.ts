import { Explore } from "./pages/Explore";
import { HomeFeed } from "./pages/Home";
import { Login } from "./pages/Login";
import { PostModal } from "./pages/postModal";
import { Profile } from "./pages/Profile";
import { Search } from "./pages/Search";
import { Signup } from "./pages/Signup";
import Router from "./router";

export const router = new Router();

router.addRoute("/", async () => {
  await new HomeFeed().load();
});
router.addRoute("/search", async () => {
  await new Search().load();
});
router.addRoute("/login", async () => {
  await new Login().load();
});
router.addRoute("/signup", async () => {
  await new Signup().load();
});
router.addRoute("/explore/:tag", async (params) => {
  if (params) {
    await new Explore().load(params.tag);
  }
});
router.addRoute("/u/:userId", async (params) => {
  if (params) {
    await new Profile().load(params.userId);
  }
});
router.addRoute("/p/:postId", async (params) => {
  if (params) {
    await PostModal.load(params.postId);
  }
});
// router.addRoute("/about", async () => await fetchView("/views/b.html"));
// router.addRoute("/contact", async () => await fetchView("/views/c.html"));
