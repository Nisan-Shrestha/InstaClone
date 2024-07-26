interface Route {
  path: string;
  loader: () => Promise<void>;
}

class Router {
  private routes: Route[] = [];

  constructor() {
    window.addEventListener("popstate", () => {
      console.log("POPPPEPPE");
      this.navigate(location.pathname);
    });

    document.addEventListener("DOMContentLoaded", () => {
      document.body.addEventListener("click", (e) => {
        const target = e.target as HTMLAnchorElement;
        if (target.matches("[data-link]")) {
          console.log(
            "Preventing Default routing and attempting navigating to page",
          );
          e.preventDefault();
          this.navigate(target.getAttribute("href")!);
        }
      });
      this.navigate(location.pathname);
    });
  }

  public addRoute(path: string, view: () => Promise<void>): void {
    this.routes.push({ path, loader: view });
    console.log("added route", path, view);
  }

  async navigate(path: string, state: object = {}): Promise<void> {
    console.info("Navigating to", path);
    history.pushState({ ...state }, "", path);
    const route = this.routes.find((r) => r.path === path) || this.routes[0];
    route.loader();
  }
}

export default Router;
