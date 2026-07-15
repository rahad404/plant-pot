import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt, bearer, admin as adminPlugin } from "better-auth/plugins";
import { mongoClient, db } from "@/lib/mongodb";
import { ac, roles } from "@/lib/permissions";

export const auth = betterAuth({
   baseURL: process.env.BETTER_AUTH_URL,
   secret: process.env.BETTER_AUTH_SECRET,

   database: mongodbAdapter(db, { client: mongoClient }),

   // Only these origins are allowed to complete auth flows / redirects.
   trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL as string],

   emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 10,
      maxPasswordLength: 128,
      // sendResetPassword: async ({ user, url }) => { await sendEmail({ to: user.email, url }) },
   },

   emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      // sendVerificationEmail: async ({ user, url }) => { await sendEmail({ to: user.email, url }) },
   },

   socialProviders: {
      google: {
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
   },

   session: {
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
