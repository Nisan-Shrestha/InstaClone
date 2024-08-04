import { signupSchema } from "../schema/Auth.Schema";
import { fetchView, request } from "../utils/utils";
import { passwordStrength } from "check-password-strength";

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
    let pwField = document.getElementById(
      "signup_password",
    ) as HTMLInputElement;
    pwField.addEventListener("input", () => {
      console.log("input");
      let pwStrength = passwordStrength(pwField.value);
      let pwStrengthText = document.getElementById(
        "passwordStrength",
      ) as HTMLElement;
      pwStrengthText.innerText = "Password Strength:  " + pwStrength.value;
      if (pwStrength.id == 0) pwStrengthText.style.color = "red";
      else if (pwStrength.id == 1) pwStrengthText.style.color = "orange";
      else if (pwStrength.id >= 2) pwStrengthText.style.color = "green";
    });
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
        ];

        let formData: { [key: string]: string } = {};
        fields.forEach(([field, schemaField, errorField]) => {
          const value = (document.getElementById(field) as HTMLInputElement)
            .value;
          formData[schemaField] = value;
          let { error } = signupSchema.extract(schemaField).validate(value);
          console.log(error);
          if (error) {
            (document.getElementById(errorField) as HTMLElement).textContent =
              error.message;
            encounteredError = true;
          }
        });

        // for pw strength
        // ["signup_password", "password", "passwordError"],
        let pwStrength = passwordStrength(
          (document.getElementById("signup_password") as HTMLInputElement)
            .value,
        );
        if (pwStrength.id < 2) {
          (
            document.getElementById("passwordError") as HTMLElement
          ).textContent =
            "Your password is too weak, ensure at least 1 number, 1 special character, 1 lowercase character and 1 uppercase character";
          encounteredError = true;
        }
        // Validate password sameness
        const passwordRetype = (
          document.getElementById("signup_password_recheck") as HTMLInputElement
        ).value;
        if (passwordRetype !== pwField.value) {
          (
            document.getElementById("passwordRecheckError") as HTMLElement
          ).textContent = "Passwords do not match";
          encounteredError = true;
        }
        formData["password"] = pwField.value;
        // encounteredError = true;
        // console.log(formData);
        if (!encounteredError) {
          alert("No errors, submitting form");
          const response = await request(
            {
              url: import.meta.env.VITE_BACKEND_URL + "/auth/signup",
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: formData,
            },
            true,
          );
          if (response.status === "error") {
            alert("Error: " + response.message);
          } else console.log("redirected?");
        }
      });
  }
}
