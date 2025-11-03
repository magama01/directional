import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        accessToken: string;
        user: {
            id: string;
            email: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        email: string;
        accessToken: string;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string;
            email: string;
            accessToken: string;
        } & DefaultUser;
        accessToken: string;
    }
}


