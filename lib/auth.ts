// lib/auth.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          console.log("================================");
          console.log("Incoming credentials:", credentials);

          const parsed = loginSchema.safeParse({
            email: credentials?.email?.toString().trim(),
            password: credentials?.password?.toString().trim(),
          });

          if (!parsed.success) {
            console.log("Schema validation failed:");
            console.log(parsed.error.flatten());
            return null;
          }

          console.log("Parsed email:", parsed.data.email);

          const user = await prisma.user.findUnique({
            where: {
              email: parsed.data.email,
            },
          });

          console.log("User found:", !!user);

          if (!user) {
            console.log("User does not exist");
            return null;
          }

          console.log("Stored hash:", user.password);

          const passwordMatch = await bcrypt.compare(
            parsed.data.password,
            user.password
          );

          console.log("Password match:", passwordMatch);

          if (!passwordMatch) {
            console.log("Password mismatch");
            return null;
          }

          console.log("Login successful");

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },

  debug: true,
});