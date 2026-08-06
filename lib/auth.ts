import type {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type AuthUser = {
    username: string;
    password: string;
};

export function getAuthUsers(): AuthUser[] {
    const raw = process.env.AUTH_USERS;
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            console.error("AUTH_USERS must be a JSON array");
            return [];
        }
        return parsed.filter(
            (user): user is AuthUser =>
                typeof user?.username === "string" &&
                typeof user?.password === "string",
        );
    } catch (error) {
        console.error("Failed to parse AUTH_USERS", error);
        return [];
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = getAuthUsers().find(
                    (entry) =>
                        entry.username === credentials.username &&
                        entry.password === credentials.password,
                );

                if (!user) {
                    return null;
                }

                return {
                    id: user.username,
                    name: user.username,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
