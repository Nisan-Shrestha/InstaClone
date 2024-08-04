import { emailSchema, loginSchema } from "../schema/Auth.Schema";
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
    //Forget Pw Handler
    document
      .getElementById("forgotPW")!
      .addEventListener("click", async (e) => {
        e.preventDefault();
        let email = prompt("Please enter your email address");
        let { error } = emailSchema.validate({ email });
        console.log("Error:", error);
        while (error && email) {
          if (error) {
            email = prompt("Invalid Email Please enter your email address");
            error = emailSchema.validate(email).error;

            console.log("Invalid email:", error!.message);
            return;
          }
        }
        if (!email) {
          alert("Seems like you remembered your password.\nEmail not sent.");
        }
        if (email) {
          let res = await request({
            url: import.meta.env.VITE_BACKEND_URL + "/utils/resetRequest",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: { email },
          });
          if (res.status == "success") {
            alert("Email sent to " + email);
          } else {
            alert("Error: " + res.message);
          }
        }
      });

    document
      .getElementById("loginform")!
      .addEventListener("submit", async function (event) {
        let error = false;
        // Prevent form submission
        event.preventDefault();

        // Clear previous errors
        document.getElementById("usernameError")!.textContent = "";
        document.getElementById("passwordError")!.textContent = "";

        const username = (
          document.getElementById("login_username") as HTMLInputElement
        ).value;

        const password = (
          document.getElementById("login_password") as HTMLInputElement
        ).value;

        if (!error) {
          const response = await request(
            {
              url: import.meta.env.VITE_BACKEND_URL + "/auth/login",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: { username, password },
            },
            true,
          );
          if (response.status === "success") {
            console.log(response);
          }

          if (response.status === "error") {
            alert("Error: somethings not right, maybe your password?" );
          }
        }
      });
  }
}
