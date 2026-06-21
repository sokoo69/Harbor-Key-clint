import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const db = mongoClient.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: "tenant",
      },
    },
  },
  socialProviders: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  } : {},
  plugins: [
    jwt({
      jwks: {
        jwksPath: "/jwks",
      },
      jwt: {
        issuer: process.env.BETTER_AUTH_URL,
        definePayload: ({ user, session }) => ({
          userId: user.id,
          email: user.email,
          role: user.role,
          sessionId: session.id,
        }),
      },
    }),
    nextCookies(),
  ],
});
