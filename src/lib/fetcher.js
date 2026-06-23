import { authClient } from "@/lib/auth-client";

async function getServerToken() {
  const res = await fetch("/api/auth/get-session", { credentials: "include" });
  const token = res.headers.get("set-auth-jwt");
  
  if (!token) {
    throw new Error("Unable to load auth token");
  }

  return token;
}

export async function fetchWithAuth(input, init = {}) {
  const token = await getServerToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, {
    ...init,
    headers,
    credentials: "include",
  });
}

export { authClient };
