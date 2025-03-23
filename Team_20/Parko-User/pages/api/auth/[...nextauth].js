  import NextAuth from "next-auth";
  import GoogleProvider from "next-auth/providers/google";

  export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async signIn({ profile }) {
        if (profile?.email.endsWith("@gmail.com")) {
          return true; // Allow all Gmail accounts
        } else {
          throw new Error("Only Gmail accounts are allowed.");
        }
      },
      async session({ session, token }) {
        session.user.id = token.sub; // Attach user ID to session
        return session;
      },
    },
    pages: {
      signIn: "/", // Redirect to homepage if not signed in
      error: "/auth/error", // Custom error page for login failures
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
  };

  export default NextAuth(authOptions);
