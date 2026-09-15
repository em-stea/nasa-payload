"use client";
import type {ComponentProps, ReactNode} from "react";

import Image from "next/image";

import {Button} from "@/shared/components/button/button";
import {Card} from "@/shared/components/card/card";
import {CloseApproachCard} from "@/shared/components/card/close-approach-card";
import {MissionCard} from "@/shared/components/card/mission-card";
import {CarouselImage} from "@/shared/components/carousel/carousel-image";
import {Heading} from "@/shared/components/heading/heading";
import {Icons} from "@/shared/components/icons";
import {ArrowRight} from "@/shared/components/icons/directional/arrow-right";
import {ModeToggle} from "@/shared/components/mode-toggle/mode-toggle";
import {Navbar} from "@/shared/components/navbar/navbar";
import {Pagination} from "@/shared/components/pagination/pagination";
import {Spinner} from "@/shared/components/spinner/spinner";
import {Text} from "@/shared/components/text/text";
import {TitleSection} from "@/shared/components/title-section/title-section";

type HeadingVariant = NonNullable<ComponentProps<typeof Heading>["variant"]>;
type HeadingLevel = NonNullable<ComponentProps<typeof Heading>["as"]>;
type TextVariant = NonNullable<ComponentProps<typeof Text>["variant"]>;
type ButtonVariant = NonNullable<ComponentProps<typeof Button>["variant"]>;
type ButtonSize = NonNullable<ComponentProps<typeof Button>["size"]>;

const SECTIONS = [
  {id: "fonts", label: "Fonts"},
  {id: "headings", label: "Headings"},
  {id: "text", label: "Text"},
  {id: "navbar", label: "Navbar"},
  {id: "title-section", label: "Title Section"},
  {id: "cards", label: "Cards"},
  {id: "carousel", label: "Carousel"},
  {id: "pagination", label: "Pagination"},
  {id: "mode-toggle", label: "Mode Toggle"},
  {id: "buttons", label: "Buttons"},
  {id: "icons", label: "Icons"},
  {id: "colors", label: "Colors"},
] as const;

const FONTS = [
  {
    name: "Space Grotesk",
    utility: "font-space-grotesk",
    token: "--font-primary",
    weights: "400 · 500 · 600 · 700",
    role: "Display — headings",
    className: "font-space-grotesk",
  },
  {
    name: "JetBrains Mono",
    utility: "font-jetbrains-mono",
    token: "--font-secondary",
    weights: "400 · 700",
    role: "Body — copy, labels, data",
    className: "font-jetbrains-mono",
  },
] as const;

const HEADINGS: {
  variant: HeadingVariant;
  as: HeadingLevel;
  spec: string;
  sample: string;
}[] = [
  {
    variant: "title.1",
    as: "h1",
    spec: "text-16 · leading-80",
    sample: "Astronomy Picture of the Day",
  },
  {variant: "title.2", as: "h2", spec: "text-8 · leading-40", sample: "Earth EPIC 3D"},
  {variant: "title.3", as: "h3", spec: "text-5 · leading-28", sample: "Parker Solar Probe"},
];

const TEXTS: {variant: TextVariant; spec: string; sample: string}[] = [
  {
    variant: "body.1",
    spec: "text-4 · leading-25.6",
    sample:
      "Witness the cosmos through the lens of NASA’s most profound observatories. Today’s feature unveils the intricate filamentary structures of the Veil Nebula.",
  },
  {
    variant: "body.2",
    spec: "text-4 · leading-24 · uppercase",
    sample: "Latitude 19.4326 / Longitude -99.1332",
  },
  {
    variant: "body.3",
    spec: "text-3_5 · leading-20",
    sample: "Touching the Sun. Revolutionizing our understanding of the corona and solar wind.",
  },
  {variant: "button.1", spec: "text-4 · leading-24 · bold", sample: "Explore more"},
  {
    variant: "eyebrow",
    spec: "text-3 · leading-16 · uppercase · tracking-1.2",
    sample: "APOD // ACTIVE",
  },
  {
    variant: "meta.1",
    spec: "text-2_5 · leading-15 · uppercase · tracking-0.5",
    sample: "DISCOVERY · T-MINUS 12 HOURS AGO",
  },
  {
    variant: "card.title",
    spec: "font-space-grotesk · text-5 · leading-28",
    sample: "James Webb Detects Water Vapor",
  },
];

const BUTTON_VARIANTS: ButtonVariant[] = ["primary"];
const BUTTON_SIZES: ButtonSize[] = ["md", "intrinsic"];

const COLOR_GROUPS = [
  {
    name: "basic",
    tokens: [
      {label: "bg-basic-00", className: "bg-basic-00", token: "--basic-00", hex: "#FFFFFF"},
      {
        label: "bg-basic-00-05",
        className: "bg-basic-00-05",
        token: "--basic-00-05",
        hex: "#FFFFFF",
      },
      {
        label: "bg-basic-00-10",
        className: "bg-basic-00-10",
        token: "--basic-00-10",
        hex: "#FFFFFF 10%",
      },
      {label: "bg-basic-200", className: "bg-basic-200", token: "--basic-200", hex: "#DADDF0"},
      {label: "bg-basic-300", className: "bg-basic-300", token: "--basic-300", hex: "#C3C6D7"},
      {label: "bg-basic-500", className: "bg-basic-500", token: "--basic-500", hex: "#8D90A0"},
      {label: "bg-basic-700", className: "bg-basic-700", token: "--basic-700", hex: "#32343D"},
      {
        label: "bg-basic-700-90",
        className: "bg-basic-700-90",
        token: "--basic-700-90",
        hex: "#32343D",
      },
      {label: "bg-basic-900", className: "bg-basic-900", token: "--basic-900", hex: "#1E1E1E"},
      {label: "bg-basic-940", className: "bg-basic-940", token: "--basic-940", hex: "#0a0f14"},
      {label: "bg-basic-950", className: "bg-basic-950", token: "--basic-950", hex: "#0A0E14"},
      {
        label: "bg-basic-950-60",
        className: "bg-basic-950-60",
        token: "--basic-950-60",
        hex: "#0A0E14 60%",
      },
      {label: "bg-basic-960", className: "bg-basic-960", token: "--basic-960", hex: "#0C0E16"},
      {
        label: "bg-basic-960-80",
        className: "bg-basic-960-80",
        token: "--basic-960-80",
        hex: "#11131B 80%",
      },
      {
        label: "bg-basic-960-90",
        className: "bg-basic-960-90",
        token: "--basic-960-90",
        hex: "#0C0E16 90%",
      },
      {label: "bg-basic-970", className: "bg-basic-970", token: "--basic-970", hex: "#0A0A0A"},
    ],
  },
  {
    name: "gray",
    tokens: [
      {label: "bg-gray-100", className: "bg-gray-100", token: "--gray-100", hex: "#E1E2ED"},
      {label: "bg-gray-200", className: "bg-gray-200", token: "--gray-200", hex: "#262626"},
      {label: "bg-gray-300", className: "bg-gray-300", token: "--gray-300", hex: "#171717"},
      {label: "bg-gray-400", className: "bg-gray-400", token: "--gray-400", hex: "#3b3b3b"},
    ],
  },
  {
    name: "blue",
    tokens: [
      {label: "bg-blue-50", className: "bg-blue-50", token: "--blue-50", hex: "#EEEFFF"},
      {label: "bg-blue-200", className: "bg-blue-200", token: "--blue-200", hex: "#B4C5FF"},
      {
        label: "bg-blue-200-30",
        className: "bg-blue-200-30",
        token: "--blue-200-30",
        hex: "#B4C5FF 30%",
      },
      {label: "bg-blue-300", className: "bg-blue-300", token: "--blue-300", hex: "#A1B2ED"},
      {label: "bg-blue-700", className: "bg-blue-700", token: "--blue-700", hex: "#2563EB"},
      {
        label: "bg-blue-700-20",
        className: "bg-blue-700-20",
        token: "--blue-700-20",
        hex: "#2563EB 20%",
      },
      {label: "bg-blue-900", className: "bg-blue-900", token: "--blue-900", hex: "#002A78"},
      {label: "bg-blue-1000", className: "bg-blue-1000", token: "--blue-1000", hex: "#031F54"},
    ],
  },
  {
    name: "red",
    tokens: [
      {label: "bg-red-200", className: "bg-red-200", token: "--red-200", hex: "#FFB4AB"},
      {label: "bg-red-300", className: "bg-red-300", token: "--red-300", hex: "#FFB3AD"},
      {label: "bg-red-700", className: "bg-red-700", token: "--red-700", hex: "#93000A"},
      {
        label: "bg-red-700-20",
        className: "bg-red-700-20",
        token: "--red-700-20",
        hex: "#93000A 20%",
      },
      {label: "bg-red-900", className: "bg-red-900", token: "--red-900", hex: "#690005"},
    ],
  },
] as const;

function sectionNumber(id: string) {
  return String(SECTIONS.findIndex((section) => section.id === id) + 1).padStart(2, "0");
}

const images = [
  {src: "/images/card-discovery.jpg", alt: "Spaceship flying through a nebula"},
  {src: "/images/card-parker-solar-probe.jpg", alt: "Parker Solar Probe approaching the Sun"},
  {src: "/images/card-discovery.jpg", alt: "Spaceship flying through a nebula"},
];

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="scroll-mt-16 border-t border-basic-900/15 py-14" id={id}>
      <div className="mb-8 flex items-baseline gap-4">
        <Text className="text-primary-foreground tabular-nums" variant="body.3">
          {sectionNumber(id)}
        </Text>
        <div>
          <Heading as="h2" className="font-bold text-primary-foreground" variant="title.3">
            {title}
          </Heading>
          <Text className="mt-1 text-primary-foreground" variant="body.3">
            {description}
          </Text>
        </div>
      </div>
      {children}
    </section>
  );
}

function Specimen({
  name,
  spec,
  children,
  stack = false,
}: {
  name: string;
  spec?: string;
  children: ReactNode;
  stack?: boolean;
}) {
  return (
    <div
      className={
        stack
          ? "border-t border-dashed border-basic-900/15 py-6 first:border-t-0 first:pt-0"
          : "grid grid-cols-1 gap-3 border-t border-dashed border-basic-900/15 py-6 first:border-t-0 first:pt-0 md:grid-cols-[14rem_1fr] md:gap-8"
      }
    >
      <div>
        <Text className="text-primary-foreground" variant="body.3">
          {name}
        </Text>
        {spec ? (
          <Text className="mt-1 text-primary-foreground" variant="body.3">
            {spec}
          </Text>
        ) : null}
      </div>
      <div className={stack ? "mt-4" : "min-w-0"}>{children}</div>
    </div>
  );
}

function Swatch({
  label,
  className,
  token,
  hex,
}: {
  label: string;
  className: string;
  token: string;
  hex: string;
}) {
  return (
    <div className="min-w-0">
      <div
        style={{
          backgroundImage:
            "linear-gradient(45deg, #c3c6d7 25%, transparent 25%), linear-gradient(-45deg, #c3c6d7 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #c3c6d7 75%), linear-gradient(-45deg, transparent 75%, #c3c6d7 75%)",
          backgroundSize: "12px 12px",
          backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0",
        }}
        className="h-14 overflow-hidden rounded-sm border border-basic-300"
      >
        <div className={`h-full w-full ${className}`} />
      </div>
      <Text className="mt-1.5 truncate text-primary-foreground" variant="body.3">
        {label}
      </Text>
      <Text className="truncate text-primary-foreground" variant="body.3">
        {token}
      </Text>
      <Text className="truncate text-primary-foreground" variant="body.3">
        {hex}
      </Text>
    </div>
  );
}

const Page = () => {
  return (
    <div className="min-h-dvh text-primary-foreground">
      <nav className="sticky top-0 z-10 border-b border-basic-900/15 bg-basic-00/90 backdrop-blur">
        <ul className="mx-auto flex max-w-5xl flex-wrap gap-x-5 gap-y-1 px-6 py-3 font-jetbrains-mono text-3 uppercase">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                className="text-basic-900/50 transition-colors hover:text-basic-900"
                href={`#${section.id}`}
              >
                <span className="tabular-nums">{sectionNumber(section.id)}</span> {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <header className="py-16">
          <Text className="text-primary-foreground" variant="eyebrow">
            Internal // Design system
          </Text>
          <Heading as="h1" className="mt-4 font-bold" variant="title.2">
            Component &amp; token reference
          </Heading>
          <Text className="mt-4 max-w-[60ch] text-primary-foreground" variant="body.3">
            Every variant exposed by <code>shared/components</code> and <code>shared/styles</code>,
            rendered from the real components. If something looks wrong here, it is wrong in the
            design system.
          </Text>
        </header>

        <Section
          description="shared/styles/foundations/fonts.ts · semantic-tokens/font.css"
          id="fonts"
          title="Fonts"
        >
          {FONTS.map((font) => (
            <Specimen key={font.name} name={font.utility} spec={`${font.token} · ${font.weights}`}>
              <Heading as="h3" className={font.className} variant="title.2">
                {font.name}
              </Heading>
              <Text className={`${font.className} mt-3 text-primary-foreground`} variant="body.1">
                ABCDEFGHIJKLM abcdefghijklm 0123456789
              </Text>
              <Text className="mt-2 text-primary-foreground" variant="body.3">
                {font.role}
              </Text>
            </Specimen>
          ))}
        </Section>

        <Section
          description="shared/components/heading · variant + as"
          id="headings"
          title="Headings"
        >
          {HEADINGS.map((heading) => (
            <Specimen
              key={heading.variant}
              name={`variant="${heading.variant}"`}
              spec={`as="${heading.as}" · ${heading.spec}`}
            >
              <Heading
                as={heading.as}
                className="text-primary-foreground"
                variant={heading.variant}
              >
                {heading.sample}
              </Heading>
            </Specimen>
          ))}

          <Specimen
            name="className override"
            spec="font-bold sobre title.3 — el peso no viene del variant"
          >
            <Heading as="h4" className="font-bold text-primary-foreground" variant="title.3">
              Parker Solar Probe
            </Heading>
          </Specimen>
        </Section>

        <Section description="shared/components/text · variant" id="text" title="Text">
          {TEXTS.map((text) => (
            <Specimen key={text.variant} name={`variant="${text.variant}"`} spec={text.spec}>
              <Text className="max-w-prose text-primary-foreground" variant={text.variant}>
                {text.sample}
              </Text>
            </Specimen>
          ))}
        </Section>

        <Section
          description="shared/components/card · compound + context · data prop"
          id="cards"
          title="Cards"
        >
          <Specimen name="Article card" spec="Figma · Article - Card 1 · <Card data={...}>">
            <div className="max-w-90 rounded-2xl p-6">
              <Card
                data={{
                  tag: "Discovery",
                  tone: "blue",
                  image: "/images/card-discovery.jpg",
                  imageAlt: "Spaceship flying through a nebula",
                  title: "James Webb Detects Water Vapor",
                  description:
                    "Revolutionary atmospheric analysis of exoplanet K2-18b reveals the presence of carbon-bearing molecules and potential…",
                  date: "T-Minus 12 Hours Ago",
                  dateTime: "2024-01-01",
                }}
              >
                <Card.Header>
                  <Card.Image />
                  <Card.Badge />
                </Card.Header>
                <Card.Body>
                  <Card.Title />
                  <Card.Description />
                </Card.Body>
                <Card.Footer>
                  <Card.Date />
                </Card.Footer>
              </Card>
            </div>
          </Specimen>

          <Specimen name="Mission card" spec="Figma · Article 1:60 · <MissionCard data={...}>">
            <div className="max-w-90 rounded-2xl p-6">
              <MissionCard
                data={{
                  tone: "blue",
                  image: "/images/card-parker-solar-probe.jpg",
                  imageAlt: "Parker Solar Probe approaching the Sun",
                  title: "Parker Solar Probe",
                  description:
                    "Touching the Sun. Revolutionizing our understanding of the corona and solar wind.",
                  stats: [
                    {label: "Speed", value: "692,000 km/h"},
                    {label: "Distance", value: "0.05 AU"},
                  ],
                }}
              />
            </div>
          </Specimen>

          <Specimen
            name="Close approach card"
            spec="Figma · Article 1:175 · <CloseApproachCard data={...}>"
          >
            <div className="max-w-90 rounded-2xl p-6">
              <CloseApproachCard
                data={{
                  tone: "red",
                  tag: "HIGH ALERT",
                  title: "2024 AB1",
                  stats: [
                    {label: "Approach date", value: "Nov 15, 2024"},
                    {label: "Miss distance", value: "0.02 AU", highlight: true},
                    {label: "Velocity", value: "12.5 km/s"},
                  ],
                }}
                tagVariant="full-filled"
              />
            </div>
          </Specimen>
        </Section>

        <Section
          description="shared/components/navbar · compound + context · data prop"
          id="navbar"
          title="Navbar"
        >
          <Specimen name="TopNavBar — desktop" spec="Figma · TopNavBar 1:267 · <Navbar data={...}>">
            <div className="w-full overflow-hidden rounded-2xl">
              <Navbar
                data={{
                  logo: {
                    src: "/images/dscovr-site-logo.svg",
                    alt: "DSCOVR",
                    href: "/",
                  },
                }}
              >
                <Navbar.Group>
                  <Navbar.Logo />
                </Navbar.Group>

                <Navbar.Group gap="md">
                  <Navbar.Link href="/news">News</Navbar.Link>
                  <Navbar.Link href="/asteroids">Asteroids</Navbar.Link>
                  <Navbar.Link href="/events">Events</Navbar.Link>
                  <Navbar.Link showDot href="/live">
                    Live
                  </Navbar.Link>
                </Navbar.Group>

                <Navbar.Group>
                  <Navbar.User />
                </Navbar.Group>
              </Navbar>
            </div>
          </Specimen>
        </Section>

        <Section description="shared/components/carousel" id="carousel" title="Carousel">
          <Specimen name="carousel" spec="shared/components/carousel">
            <CarouselImage
              renderItem={(item) => (
                <Image
                  alt={item.alt}
                  className="h-full w-full object-cover"
                  height={400}
                  src={item.src}
                  width={600}
                />
              )}
              items={images}
            />
          </Specimen>
        </Section>

        <Section description="shared/components/pagination" id="pagination" title="Pagination">
          <Specimen name="pagination" spec="shared/components/pagination">
            <Pagination buildHref={(page) => `?page=${page}`} page={1} totalPages={45} />
          </Specimen>
        </Section>

        <Section description="shared/components/mode-toggle" id="mode-toggle" title="Mode Toggle">
          <Specimen name="mode-toggle" spec="shared/components/mode-toggle">
            <div className="flex items-center gap-10">
              <ModeToggle />
            </div>
          </Specimen>
        </Section>

        <Section
          description="shared/components/button · variant × size × state"
          id="buttons"
          title="Buttons"
        >
          {BUTTON_VARIANTS.map((variant) => (
            <Specimen key={variant} name={`variant="${variant}"`} spec="todos los size">
              <div className="flex flex-wrap items-center gap-3">
                {BUTTON_SIZES.map((size) => (
                  <Button key={size} size={size} variant={variant}>
                    {size}
                  </Button>
                ))}
              </div>
            </Specimen>
          ))}

          <Specimen name="states" spec="default · disabled · loading">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="md" variant="primary">
                Explore more
              </Button>
              <Button disabled size="md" variant="primary">
                Disabled
              </Button>
              <Button loading size="md" variant="primary">
                Explore more
              </Button>
            </div>
            <Text className="mt-3 text-primary-foreground" variant="body.3">
              con loading el children se reemplaza por el Spinner
            </Text>
          </Specimen>

          <Specimen name="loading" spec="shared/components/spinner · hereda currentColor">
            <div className="flex flex-wrap items-center gap-6">
              <Spinner />
              <Spinner className="size-5 text-blue-700" />
              <Spinner className="size-4 text-red-700" />
            </div>
          </Specimen>

          <Specimen name="asChild" spec="renderiza un <a> con los estilos del button">
            <Button asChild size="md" variant="primary">
              <a href="#buttons">Link as button</a>
            </Button>
          </Specimen>

          <Specimen name='size="auto"' spec="w-auto">
            <Button className="gap-2" variant="primary">
              Explore more
              <ArrowRight className="size-5" />
            </Button>
            <Button className="gap-2" size="md" variant="text-link">
              VIEW ALL ARCHIVES
              <ArrowRight className="size-5" />
            </Button>
          </Specimen>
        </Section>

        <Section
          description="shared/components/icons · fill=currentColor, 24×24"
          id="icons"
          title="Icons"
        >
          <Specimen name="className" spec="el color se pasa con una utility text-*">
            <div className="flex flex-wrap items-center gap-0">
              <Icons className="text-blue-700" />
            </div>
          </Specimen>
        </Section>

        <Section
          description="shared/styles/foundations/colors.css · semantic-tokens/colors.css"
          id="colors"
          title="Colors"
        >
          {COLOR_GROUPS.map((group) => (
            <Specimen stack key={group.name} name={group.name} spec="foundation → utility">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {group.tokens.map((swatch) => (
                  <Swatch
                    className={swatch.className}
                    hex={swatch.hex}
                    key={swatch.label}
                    label={swatch.label}
                    token={swatch.token}
                  />
                ))}
              </div>
            </Specimen>
          ))}
        </Section>
      </main>
    </div>
  );
};

export default Page;
