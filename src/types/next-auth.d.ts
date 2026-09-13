import type {DefaultSession} from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      /** Id del provider OAuth con el que se autenticó ('google' | 'github'). */
      provider?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
  }
}
