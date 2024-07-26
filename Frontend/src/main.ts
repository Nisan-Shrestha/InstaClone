import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import Router from "./router";

export const router = new Router();

router.addRoute("/", async () => {
  new Home().load();
});
router.addRoute("/login", async () => {
  new Login().load();
});
router.addRoute("/signup", async () => {
  new Signup().load();
});
// router.addRoute("/about", async () => await fetchView("/views/b.html"));
// router.addRoute("/contact", async () => await fetchView("/views/c.html"));
