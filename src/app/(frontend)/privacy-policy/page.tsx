import type {Metadata} from "next";

import {Container} from "@/shared/components/container/container";
import {Heading} from "@/shared/components/heading/heading";
import {Text} from "@/shared/components/text/text";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Las noticias que guardaste para leer después.",
};

export const instant = true;

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-background pt-24 pb-32 text-primary-foreground">
      <Container className="flex flex-col items-start gap-8">
        <header className="gap-1.8 flex w-full flex-col border-b border-border pt-20 pb-6">
          <Text className="flex flex-wrap items-baseline gap-2" variant="body.4">
            <span className="text-foreground">SYS.MSG LEGAL_DOCS</span>
            <span className="text-basic-500">
              Information regarding data collection, privacy, and user accounts.
            </span>
          </Text>

          <Heading as="h1" className="leading-13.2 text-12 tracking-n0.96" variant="title.1-bold">
            Privacy Policy
          </Heading>

          <Text className="max-w-2xl text-basic-500" variant="body.1">
            How we collect, store, and process data across DSCOVR.
          </Text>
        </header>

        <div className="flex flex-col gap-10 pt-6 pb-16">
          <section className="flex flex-col gap-3">
            <Heading className="text-primary" variant="title.5">
              1. Data Collection & OAuth
            </Heading>
            <Text className="leading-relaxed text-basic-500">
              When you sign in using GitHub or Google via Auth.js, we receive basic profile details
              (name, email address, and avatar URL) to establish your reader account (`site-user`).
              We do not collect passwords or process sensitive personal data.
            </Text>
          </section>

          <section className="flex flex-col gap-2">
            <Heading className="text-primary" variant="title.5">
              2. Comments & Interactive Content
            </Heading>
            <Text className="leading-relaxed text-basic-500">
              Comments submitted on news articles and transmissions are stored in our backend
              (`Payload CMS`). Anonymous comments are saved without linked profile credentials. All
              submitted comments undergo moderation (`pending` state) before appearing publicly.
            </Text>
          </section>

          <section className="flex flex-col gap-2">
            <Heading className="text-primary" variant="title.5">
              3. Local Storage & Session Cookies
            </Heading>
            <Text className="leading-relaxed text-basic-500">
              We use secure, HTTP-only session cookies (`AUTH_SECRET`) solely to manage
              authentication state. Your browser’s `localStorage` may be used to save UI
              configuration preferences, such as active theme selection or bookmarking preferences.
            </Text>
          </section>

          <section className="flex flex-col gap-2">
            <Heading className="text-primary" variant="title.5">
              4. External APIs & Third-Party Data
            </Heading>
            <Text className="leading-relaxed text-basic-500">
              DSCOVR retrieves content directly from public API endpoints, including NASA Open APIs,
              EPIC, EONET, NeoWs, and The Space Devs. Your interactions with these datasets adhere
              to public data access standards, and no personal profile information is shared with
              external API providers.
            </Text>
          </section>

          <section className="flex flex-col gap-2">
            <Heading className="text-primary" variant="title.5">
              5. Data Usage & Analytics
            </Heading>
            <Text className="leading-relaxed text-basic-500">
              We do not sell, rent, or trade personal data to advertising networks. Account metrics
              and comments are used exclusively to support platform functionality, user
              notifications, and comment interaction trees.
            </Text>
          </section>
        </div>
      </Container>
    </main>
  );
}
