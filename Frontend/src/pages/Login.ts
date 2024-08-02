import { loginSchema } from "../schema/login.Schema";
import { fetchView, request } from "../utils/utils";

export class Login {
  async load() {
    console.log("Loadin from state: ", window.history.state.currentView);
    if (
      !window.history.state ||
      window.history.state.currentView != "loggedOut"
    ) {
      let data = await fetchView("/views/LoggedOut.html");
      document.getElementById("app")!.innerHTML = data;
      window.history.replaceState(
        { ...window.history.state, currentView: "loggedOut" },
        "",
        null,
      );
    }
    let formHtml = await fetchView("/component/LoginForm.html");
    document.getElementById("formHolder")!.innerHTML = formHtml;

    let formAltCTA = await fetchView("/component/AltSignup.html");
    document.getElementById("formAltCTA")!.innerHTML = formAltCTA;

    document
      .getElementById("GoogleLoginLink")!
      .setAttribute("href", "http://localhost:8000/auth/login/google");

    this.setup();
  }

  setup() {
    document
      .getElementById("loginform")!
      .addEventListener("submit", async function (event) {
        let error = false;
        // Prevent form submission
        event.preventDefault();

        // Clear previous errors
        document.getElementById("usernameError")!.textContent = "";
        document.getElementById("passwordError")!.textContent = "";

        // Validate username

        const username = (
          document.getElementById("login_username") as HTMLInputElement
        ).value;
        let { error: usernameError } = loginSchema
          .extract("username")
          .validate(username);
        if (usernameError) {
          (
            document.getElementById("usernameError") as HTMLElement
          ).textContent = usernameError.message;
          error = true;
        }

        const password = (
          document.getElementById("login_password") as HTMLInputElement
        ).value;
        const { error: passwordError } = loginSchema
          .extract("password")
          .validate(password);
        if (passwordError) {
          (
            document.getElementById("passwordError") as HTMLElement
          ).textContent = passwordError.message;
          error = true;
        }
        localStorage.setItem("username", username);

        if (!error) {
          const response = await request(
            {
              url: import.meta.env.VITE_BACKEND_URL + "/auth/login",
              method: "POST",
              header: {
                "Content-Type": "application/json",
              },
              body: { username, password },
            },
            true,
          );
          if (response.status === "success") {
          }

          if (response.status === "error") {
            // TODO: implement error toast
          }
          // TODO: check if this works as expected.
        }
      });
  }
}
