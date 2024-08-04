interface Route {
  path: string;
  pattern: RegExp;
  loader: (params?: Record<string, string>) => Promise<void>;
}

class Router {
  private routes: Route[] = [];

  constructor() {
    window.addEventListener("popstate", () => {
      this.navigate(location.pathname);
    });

    document.addEventListener("DOMContentLoaded", () => {
      document.body.addEventListener("click", (e) => {
        let target = e.target as HTMLAnchorElement;
        if (target.matches("[get-parent-a]")) {
          target = target.closest("a[data-link]")!;
        }
        if (target.matches("[data-link]")) {
          console.log("target:", target);
          console.log(
            "Preventing Default routing and attempting navigating to page",
          );
          e.preventDefault();
          this.navigate(target.getAttribute("href")!, window.history.state);
        }
      });
      this.navigate(location.pathname);
    });
  }

  public addRoute(
    path: string,
    loader: (params?: Record<string, string>) => Promise<void>,
  ): void {
    const pattern = this.pathToRegex(path);
    this.routes.push({ path, pattern, loader });
    console.log("added route", path, loader);
  }

  private pathToRegex(path: string): RegExp {
    return new RegExp("^" + path.replace(/\/:\w+/g, "(?:/([^/]+))?") + "$");
  }

  private getParams(route: Route, path: string): Record<string, string> {
    const values = path.match(route.pattern)?.slice(1) || [];
    const keys = Array.from(route.path.matchAll(/:(\w+)/g)).map(
      (result) => result[1],
    );
    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  }

  async navigate(path: string, state: object = {}): Promise<void> {
    path = path.trim();
    console.info(`Navigating to '${path}'`, this.routes);
    history.pushState({ ...state }, "", path);

    const route =
      this.routes.find((r) => r.pattern.test(path)) ||
      this.routes.find((r) => r.pattern.test("/notFound")) ||
      this.routes[0];
    const params = this.getParams(route, path);
    console.log(route, params);

    await route.loader(params);
    console.log("state: ", window.history.state.currentView);
  }
}
export default Router;
