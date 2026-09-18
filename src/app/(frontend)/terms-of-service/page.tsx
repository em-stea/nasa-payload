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
            <span className="text-foreground">SYS.MSG LEGAL_TERMS</span>
            <span className="text-basic-500">
              Rules, guidelines, and terms governing your use of DSCOVR.
            </span>
          </Text>

          <Heading as="h1" className="leading-13.2 text-12 tracking-n0.96" variant="title.1-bold">
            Terms of Service
          </Heading>

          <Text className="max-w-2xl text-basic-500" variant="body.1">
            Terms of service and operational conditions.
          </Text>
        </header>

        <div className="flex flex-col gap-10 pt-6 pb-16">
          <section className="flex flex-col gap-2">
            <Heading className="text-primary" variant="title.5">
              1. NASA Disclaimer & Non-Affiliation
            </Heading>
            <Text className="leading-relaxed text-basic-500">
              DSCOVR is an independent, open-source web application designed for exploring public
              space data. This project is powered by NASA Open APIs and third-party space services,
              but is <strong>not affiliated with, endorsed by, or representative of NASA</strong>,
              the Jet Propulsion Laboratory (JPL), or any government agency.
            </Text>
          </section>

          <section className="flex flex-col gap-2">
            <Heading className="text-primary" variant="title.5">
              2. Intellectual Property & Media Usage
            </Heading>
            <Text className="leading-relaxed text-basic-500">
              All mission data, imagery, satellite feeds, and news items retrieved from external
              services belong to their respective copyright holders and are distributed under
              NASA&apos;s public media guidelines. Original application source code, UI components,
              and design systems belong to the DSCOVR platform project.
            </Text>
          </section>

          <section className="flex flex-col gap-2">
            <Heading className="text-primary" variant="title.5">
              3. User Conduct & Comment Moderation
            </Heading>
            <Text className="leading-relaxed text-basic-500">
              By submitting comments or interacting on the platform, you agree to engage
              respectfully. All user comments enter a moderation queue (<code>pending</code> status)
              prior to publication. We reserve the right to edit, reject, or purge any content
              containing spam, hate speech, or abuse without prior notice.
            </Text>
          </section>

          <section className="flex flex-col gap-3">
            <Heading className="text-primary" variant="title.5">
              4. Service Availability & API Reliance
            </Heading>
            <Text className="leading-relaxed text-basic-500">
              DSCOVR relies on external API endpoints for real-time mission telemetry, daily
              imagery, and launch schedules. We offer no guarantees regarding continuous service
              availability, response times, or rate limits imposed by third-party data providers.
            </Text>
          </section>

          <section className="flex flex-col gap-2">
            <Heading className="text-primary" variant="title.5">
              5. Disclaimer of Liability
            </Heading>
            <Text className="leading-relaxed text-basic-500">
              The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis for
              educational and informational purposes. The maintainers of DSCOVR shall not be held
              liable for any damages or data loss resulting from your use of this platform.
            </Text>
          </section>
        </div>
      </Container>
    </main>
  );
}
