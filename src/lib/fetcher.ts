import { authClient } from "@/lib/auth-client";

async function getServerToken() {
  const response = await authClient.jwt();
  
  if (!response.data?.token) {
    throw new Error("Unable to load auth token");
  }

  return response.data.token;
}

export async function fetchWithAuth(input: string, init: RequestInit = {}) {
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
