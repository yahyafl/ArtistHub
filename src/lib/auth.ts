import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        });

        if (!user) return null;

        // Check status
        if (user.status === "PENDING") {
          throw new Error("PENDING");
        }
        if (user.status === "REJECTED") {
          throw new Error("REJECTED");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        // Extract permission names
        const permissions = user.role?.permissions.map(
          (rp) => rp.permission.name
        ) || [];

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role?.name || "No Role",
          roleId: user.roleId,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.roleId = (user as any).roleId;
        token.permissions = (user as any).permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).roleId = token.roleId;
        (session.user as any).permissions = token.permissions;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});