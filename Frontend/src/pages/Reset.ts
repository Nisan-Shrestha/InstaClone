import { passwordStrength } from "check-password-strength";
import { fetchView, request } from "../utils/utils";
import { router } from "../main";

export class Reset {
  async load(token: string) {
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

    const app = document.getElementById("app") as HTMLDivElement;
    app.innerHTML = await fetchView("/component/PasswordForm.html");
    this.setup(token);
  }

  setup(token: string) {
    let pwField = document.getElementById("reset_password") as HTMLInputElement;
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
      .getElementById("editForm")!
      .addEventListener("submit", async function (event) {
        let encounteredError = false;
        event.preventDefault();
        let formData: { [key: string]: string } = {};
        let pwStrength = passwordStrength(
          (document.getElementById("reset_password") as HTMLInputElement).value,
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
          document.getElementById("reset_password_recheck") as HTMLInputElement
        ).value;
        if (passwordRetype !== pwField.value) {
          (
            document.getElementById("passwordRecheckError") as HTMLElement
          ).textContent = "Passwords do not match";
          encounteredError = true;
        }
        formData["password"] = pwField.value;

        if (!encounteredError) {
          let res = await request({
            url: import.meta.env.VITE_BACKEND_URL + "/user/reset-pw-email",
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: { ...formData, token: token },
          });
          if (res.status == "success") {
            alert("Changed succesfully please continue to login");
            router.navigate("/login");
          } else {
            alert("Error changing password, please try again");
            router.navigate("/login");
          }
        }
      });
  }
}
