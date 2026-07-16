import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt, bearer, admin as adminPlugin } from "better-auth/plugins";
import { mongoClient, db } from "@/lib/mongodb";
import { ac, roles } from "@/lib/permissions";

export const auth = betterAuth({
   baseURL: process.env.BETTER_AUTH_URL,
   secret: process.env.BETTER_AUTH_SECRET,

   database: mongodbAdapter(db, { client: mongoClient, usePlural: true }),

   // Only these origins are allowed to complete auth flows / redirects.
   trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL as string],

   user: {
      modelName: "users",
   },

   emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 6,
      maxPasswordLength: 128,
   },

   emailVerification: {
      sendOnSignUp: false,
      autoSignInAfterVerification: true,
   },

   socialProviders: {
      google: {
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
   },

   session: {
      modelName: "sessions",
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: true, maxAge: 60 * 5 },
   },

   advanced: {
      useSecureCookies: process.env.NODE_ENV === "production",
   },

   rateLimit: {
      enabled: true,
      window: 60,
      max: 20,
   },

   plugins: [
      jwt(),
      bearer(),
      adminPlugin({ ac, roles }),
   ],
});
