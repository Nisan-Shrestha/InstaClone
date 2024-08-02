import { signupSchema } from "../schema/signup.Schema";
import { fetchView, request } from "../utils/utils";

export class Signup {
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
    let formHtml = await fetchView("/component/SignupForm.html");
    // console.log(formHtml);
    document.getElementById("formHolder")!.innerHTML = formHtml;

    let formAltCTA = await fetchView("/component/AltLogin.html");
    // console.log(formAltCTA);
    document.getElementById("formAltCTA")!.innerHTML = formAltCTA;

    document
      .getElementById("GoogleLoginLink")!
      .setAttribute("href", "http://localhost:8000/auth/signup/google");
    this.setup();
  }

  setup() {
    document
      .getElementById("signupform")!
      .addEventListener("submit", async function (event) {
        let encounteredError = false;
        // Prevent form submission
        event.preventDefault();

        // Clear previous errors
        document.getElementById("emailError")!.textContent = "";
        document.getElementById("fullnameError")!.textContent = "";
        document.getElementById("usernameError")!.textContent = "";
        document.getElementById("passwordError")!.textContent = "";
        document.getElementById("passwordRecheckError")!.textContent = "";

        // Validate
        let fields = [
          ["signup_email", "email", "emailError"],
          ["signup_fullname", "name", "fullnameError"],
          ["signup_username", "username", "usernameError"],
          ["signup_password", "password", "passwordError"],
        ];

        let formData: { [key: string]: string } = {};
        fields.forEach(([field, schemaField, errorField]) => {
          const value = (document.getElementById(field) as HTMLInputElement)
            .value;
          formData[schemaField] = value;
          let { error } = signupSchema.extract(schemaField).validate(value);
          if (error) {
            (document.getElementById(errorField) as HTMLElement).textContent =
              error.message;
            encounteredError = true;
          }
        });

        // Validate password sameness
        const passwordRetype = (
          document.getElementById("signup_password_recheck") as HTMLInputElement
        ).value;
        if (passwordRetype !== formData["password"]) {
          (
            document.getElementById("passwordRecheckError") as HTMLElement
          ).textContent = "Passwords do not match";
          encounteredError = true;
        }
        // encounteredError = true;
        // console.log(formData);
        if (!encounteredError) {
          alert("No errors, submitting form");
          const response = await request(
            {
              url: import.meta.env.VITE_BACKEND_URL + "/auth/signup",
              method: "POST",
              header: { "Content-Type": "application/json" },
              body: formData,
            },
            true,
          );
          if (response.status === "error") {
            // TODO: show toasts
          } else console.log("redirected?");
          // const response = await request(
          //   "http://localhost:8000/auth/login",
          //   "POST",
          //   {
          //     "Content-Type": "application/json",
          //   },
          //   { ...formData }
          // );

          // if (response.status === "error") {
          //   // TODO: implement error toast
          // }
          // TODO: check if this works as expected.
        }
      });
  }
}
