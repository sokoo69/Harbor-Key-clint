import { createAuthClient } from "better-auth/react";
import { genericOAuthClient, inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth` : "http://localhost:3000/api/auth",
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
      },
    }),
    genericOAuthClient(),
    jwtClient({
      jwks: {
        jwksPath: "/api/auth/jwks",
      },
    }),
  ],
});
