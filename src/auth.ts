import NextAuth, {type NextAuthConfig} from "next-auth"
import Credentials from "next-auth/providers/credentials"

const authConfig = {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials as { email: string, password: string };
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email,
                            password,
                        }),
                        cache: 'no-store'
                    });

                    if (!response.ok) {
                        console.error(`Login API failed with status: ${response.status}`);
                        return null;
                    }
                    const data = await response.json();


                    if (!!data.token && !!data.user) {


                        return {
                            id: data.user.id,
                            userId: data.user.id,
                            email: data.user.email,
                            accessToken: data.token,
                        };
                    }

                    return null;

                } catch (error) {
                    console.error('네트워크 또는 API 호출 중 오류 발생:', error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
                token.accessToken = user.accessToken;
            }
            return token;
        },

        async session({ session, token }) {

            session.user.id = token.user.id as string;
            session.user.email = token.user.email as string;
            session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    secret : process.env.AUTH_SECRET,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
