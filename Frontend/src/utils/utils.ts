import { router } from "../main";

export async function fetchView(url: string): Promise<string> {
  const response = await fetch(url);
  let text = await response.text();
  // console.log("fetched " + url, "\n", text);
  return text;
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export async function request(
  Params: {
    url: string;
    method: string;

    header?: object;
    body?: object;
    other?: object;
  } = { url: "", method: "GET" },
  allowUnauthorized: boolean = false,
): Promise<{ status: string; message: string; payload: any }> {
  if (!allowUnauthorized) {
    if (!getCookie("refreshTokenValid")) {
      router.navigate("/login");
      return {
        status: "redirected",
        message: "Redirected to Login",
        payload: {},
      };
    }

    if (!getCookie("accessTokenValid")) {
      await request(
        {
          url: import.meta.env.VITE_BACKEND_URL + "/auth/refresh",
          method: "GET",
        },
        (allowUnauthorized = true),
      );
    }
  }

  const response = await fetch(Params.url, {
    method: Params.method,
    headers: Params.header as HeadersInit,
    body: Params.method == "GET" ? null : JSON.stringify(Params.body),
    ...Params.other,
    credentials: "include",
  });

  const status = response.status;

  if (status >= 200 && status < 300) {
    const data = await response.json();
    const { message, payload } = data;
    return { status: "success", message, payload };
  } else if (status >= 300 && status < 400) {
    const data = await response.json();
    router.navigate(data.payload.redirectTo);
    return { status: "redirected", message: "Redirected", payload: {} };
  } else if (status >= 400) {
    const data = await response.json();
    const { message, payload } = data;
    return { status: "error", message, payload };
  } else {
    return { status: "error", message: "Error Occured", payload: {} };
  }
  // } catch (err) {
  //   console.error(err);
  //   return { status: "error", message: "Error Occured", payload: err };
  // }
}
