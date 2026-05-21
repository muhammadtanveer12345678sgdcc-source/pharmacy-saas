import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "store@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // ڈیٹا بیس میں چیک کریں کہ کیا اس ای میل کا کوئی سٹور ہے؟
        const store = await prisma.store.findUnique({
          where: { email: credentials.email }
        });

        if (!store) {
          return null;
        }

        // پاسورڈ کو ڈی کوڈ (Decrypt) کر کے میچ کریں
        const isPasswordValid = await bcrypt.compare(credentials.password, store.password);

        if (!isPasswordValid) {
          return null;
        }

        // اگر سب کچھ ٹھیک ہے تو سیشن میں ڈیٹا بھیج دیں
        return {
          id: store.id,
          name: store.name,
          email: store.email,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login", // ہم اپنا کسٹم VIP لاگ ان پیج بنائیں گے
  }
});

export { handler as GET, handler as POST };