import NextAuth from "next-auth";
import { authOptions } from "./options";

// Next auth is an methid that takes all the auth option credentials 
const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}