import { createAuthClient } from "better-auth/react";
import { genericOAuthClient, inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
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
