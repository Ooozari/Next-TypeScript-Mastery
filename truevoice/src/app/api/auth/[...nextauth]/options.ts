import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel, { IUser } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ): Promise<User | null> {
        if (!credentials) return null;

        await dbConnect();

        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user) throw new Error("No user found");
        if (!user.isVerified) throw new Error("Please verify your account first");

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) throw new Error("Incorrect password");

        // Map Mongoose user to NextAuth User
        const nextAuthUser: User = {
          id: user._id?.toString() || "",
          name: user.username,
          email: user.email,
        };

        return nextAuthUser;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id;
        token.username = user.name || "";
        token.isVerified = user.isVerified;
        token.isAcceptingMsg = user.isAcceptingMsg;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          _id: token._id,
          username: token.username,
          isVerified: token.isVerified,
          isAcceptingMsg: token.isAcceptingMsg,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
