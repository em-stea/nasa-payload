import type { ComponentProps, ReactNode } from 'react'

import { Button } from '@/shared/components/button/button'
import { Heading } from '@/shared/components/heading/heading'
import { Icons } from '@/shared/components/icons'
import { Spinner } from '@/shared/components/spinner/spinner'
import { Text } from '@/shared/components/text/text'
import { ArrowRight } from '@/shared/components/icons/directional/arrow-right'

type HeadingVariant = NonNullable<ComponentProps<typeof Heading>['variant']>
type HeadingLevel = NonNullable<ComponentProps<typeof Heading>['as']>
type TextVariant = NonNullable<ComponentProps<typeof Text>['variant']>
type ButtonVariant = NonNullable<ComponentProps<typeof Button>['variant']>
type ButtonSize = NonNullable<ComponentProps<typeof Button>['size']>

const SECTIONS = [
  { id: 'fonts', label: 'Fonts' },
  { id: 'headings', label: 'Headings' },
  { id: 'text', label: 'Text' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'icons', label: 'Icons' },
  { id: 'colors', label: 'Colors' },
  { id: 'scale', label: 'Type scale' },
  { id: 'pending', label: 'Not migrated' },
] as const

const FONTS = [
  {
    name: 'Space Grotesk',
    utility: 'font-space-grotesk',
    token: '--font-primary',
    weights: '400 · 500 · 600 · 700',
    role: 'Display — headings',
    className: 'font-space-grotesk',
  },
  {
    name: 'JetBrains Mono',
    utility: 'font-jetbrains-mono',
    token: '--font-secondary',
    weights: '400 · 700',
    role: 'Body — copy, labels, data',
    className: 'font-jetbrains-mono',
  },
] as const

const HEADINGS: {
  variant: HeadingVariant
  as: HeadingLevel
  spec: string
  sample: string
}[] = [
  {
    variant: 'title.1',
    as: 'h1',
    spec: 'text-16 · leading-80',
    sample: 'Astronomy Picture of the Day',
  },
  { variant: 'title.2', as: 'h2', spec: 'text-8 · leading-40', sample: 'Earth EPIC 3D' },
  { variant: 'title.3', as: 'h3', spec: 'text-5 · leading-28', sample: 'Parker Solar Probe' },
]

const TEXTS: { variant: TextVariant; spec: string; sample: string }[] = [
  {
    variant: 'body.1',
    spec: 'text-4 · leading-25.6',
    sample:
      'Witness the cosmos through the lens of NASA’s most profound observatories. Today’s feature unveils the intricate filamentary structures of the Veil Nebula.',
  },
  {
    variant: 'body.2',
    spec: 'text-4 · leading-24 · uppercase',
    sample: 'Latitude 19.4326 / Longitude -99.1332',
  },
  {
    variant: 'body.3',
    spec: 'text-3_5 · leading-20',
    sample: 'Touching the Sun. Revolutionizing our understanding of the corona and solar wind.',
  },
  { variant: 'button.1', spec: 'text-4 · leading-24 · bold', sample: 'Explore more' },
  {
    variant: 'eyebrow',
    spec: 'text-3 · leading-16 · uppercase · tracking-1.2',
    sample: 'APOD // ACTIVE',
  },
]

const BUTTON_VARIANTS: ButtonVariant[] = ['primary']
const BUTTON_SIZES: ButtonSize[] = ['md', 'intrinsic']

const COLOR_GROUPS = [
  {
    name: 'basic',
    tokens: [
      { label: 'bg-basic-00', className: 'bg-basic-00', token: '--basic-00', hex: '#FFFFFF' },
      { label: 'bg-basic-300', className: 'bg-basic-300', token: '--basic-300', hex: '#C3C6D7' },
      { label: 'bg-basic-700', className: 'bg-basic-700', token: '--basic-700', hex: '#32343D' },
      { label: 'bg-basic-900', className: 'bg-basic-900', token: '--basic-900', hex: '#1E1E1E' },
      { label: 'bg-basic-950', className: 'bg-basic-950', token: '--basic-950', hex: '#0A0E14' },
      {
        label: 'bg-basic-950-60',
        className: 'bg-basic-950-60',
        token: '--basic-950-60',
        hex: '#0A0E14 60%',
      },
      { label: 'bg-basic-960', className: 'bg-basic-960', token: '--basic-960', hex: '#0C0E16' },
      {
        label: 'bg-basic-960-90',
        className: 'bg-basic-960-90',
        token: '--basic-960-90',
        hex: '#0C0E16 90%',
      },
    ],
  },
  {
    name: 'blue',
    tokens: [
      { label: 'bg-blue-50', className: 'bg-blue-50', token: '--blue-50', hex: '#EEEFFF' },
      { label: 'bg-blue-200', className: 'bg-blue-200', token: '--blue-200', hex: '#B4C5FF' },
      {
        label: 'bg-blue-200-30',
        className: 'bg-blue-200-30',
        token: '--blue-200-30',
        hex: '#B4C5FF 30%',
      },
      { label: 'bg-blue-700', className: 'bg-blue-700', token: '--blue-700', hex: '#2563EB' },
      {
        label: 'bg-blue-700-20',
        className: 'bg-blue-700-20',
        token: '--blue-700-20',
        hex: '#2563EB 20%',
      },
      { label: 'bg-blue-900', className: 'bg-blue-900', token: '--blue-900', hex: '#002A78' },
    ],
  },
  {
    name: 'red',
    tokens: [
      { label: 'bg-red-200', className: 'bg-red-200', token: '--red-200', hex: '#FFB4AB' },
      { label: 'bg-red-300', className: 'bg-red-300', token: '--red-300', hex: '#FFB3AD' },
      { label: 'bg-red-700', className: 'bg-red-700', token: '--red-700', hex: '#93000A' },
      {
        label: 'bg-red-700-20',
        className: 'bg-red-700-20',
        token: '--red-700-20',
        hex: '#93000A 20%',
      },
      { label: 'bg-red-900', className: 'bg-red-900', token: '--red-900', hex: '#690005' },
    ],
  },
] as const

function sectionNumber(id: string) {
  return String(SECTIONS.findIndex((section) => section.id === id) + 1).padStart(2, '0')
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-basic-900/15 py-14">
      <div className="mb-8 flex items-baseline gap-4">
        <Text variant="body.3" className="text-basic-900/40 tabular-nums">
          {sectionNumber(id)}
        </Text>
        <div>
          <Heading as="h2" variant="title.3" className="font-bold">
            {title}
          </Heading>
          <Text variant="body.3" className="mt-1 text-basic-900/50">
            {description}
          </Text>
        </div>
      </div>
      {children}
    </section>
  )
}

function Specimen({
  name,
  spec,
  children,
  stack = false,
}: {
  name: string
  spec?: string
  children: ReactNode
  stack?: boolean
}) {
  return (
    <div
      className={
        stack
          ? 'border-t border-dashed border-basic-900/15 py-6 first:border-t-0 first:pt-0'
          : 'grid grid-cols-1 gap-3 border-t border-dashed border-basic-900/15 py-6 first:border-t-0 first:pt-0 md:grid-cols-[14rem_1fr] md:gap-8'
      }
    >
      <div>
        <Text variant="body.3">{name}</Text>
        {spec ? (
          <Text variant="body.3" className="mt-1  text-basic-900/45">
            {spec}
          </Text>
        ) : null}
      </div>
      <div className={stack ? 'mt-4' : 'min-w-0'}>{children}</div>
    </div>
  )
}

function Swatch({
  label,
  className,
  token,
  hex,
}: {
  label: string
  className: string
  token: string
  hex: string
}) {
  return (
    <div className="min-w-0">
      <div
        className="h-14 overflow-hidden rounded-sm border border-basic-300"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #c3c6d7 25%, transparent 25%), linear-gradient(-45deg, #c3c6d7 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #c3c6d7 75%), linear-gradient(-45deg, transparent 75%, #c3c6d7 75%)',
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0',
        }}
      >
        <div className={`h-full w-full ${className}`} />
      </div>
      <Text variant="body.3" className="mt-1.5 truncate">
        {label}
      </Text>
      <Text variant="body.3" className="truncate text-basic-900/40">
        {token}
      </Text>
      <Text variant="body.3" className="truncate text-basic-900/40">
        {hex}
      </Text>
    </div>
  )
}

const Page = () => {
  return (
    <div className="min-h-dvh bg-basic-00 text-basic-900">
      <nav className="sticky top-0 z-10 border-b border-basic-900/15 bg-basic-00/90 backdrop-blur">
        <ul className="mx-auto flex max-w-5xl flex-wrap gap-x-5 gap-y-1 px-6 py-3 font-jetbrains-mono text-3 uppercase">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-basic-900/50 transition-colors hover:text-basic-900"
              >
                <span className="tabular-nums">{sectionNumber(section.id)}</span> {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <header className="py-16">
          <Text variant="eyebrow" className="text-basic-900/50">
            Internal // Design system
          </Text>
          <Heading as="h1" variant="title.2" className="mt-4 font-bold">
            Component &amp; token reference
          </Heading>
          <Text variant="body.3" className="mt-4 max-w-[60ch] text-basic-900/60">
            Every variant exposed by <code>shared/components</code> and <code>shared/styles</code>,
            rendered from the real components. If something looks wrong here, it is wrong in the
            design system.
          </Text>
        </header>

        <Section
          id="fonts"
          title="Fonts"
          description="shared/styles/foundations/fonts.ts · semantic-tokens/font.css"
        >
          {FONTS.map((font) => (
            <Specimen key={font.name} name={font.utility} spec={`${font.token} · ${font.weights}`}>
              <Heading as="h3" variant="title.2" className={font.className}>
                {font.name}
              </Heading>
              <Text variant="body.1" className={`${font.className} mt-3 text-basic-900/70`}>
                ABCDEFGHIJKLM abcdefghijklm 0123456789
              </Text>
              <Text variant="body.3" className="mt-2 text-basic-900/45">
                {font.role}
              </Text>
            </Specimen>
          ))}
        </Section>

        <Section
          id="headings"
          title="Headings"
          description="shared/components/heading · variant + as"
        >
          {HEADINGS.map((heading) => (
            <Specimen
              key={heading.variant}
              name={`variant="${heading.variant}"`}
              spec={`as="${heading.as}" · ${heading.spec}`}
            >
              <Heading as={heading.as} variant={heading.variant}>
                {heading.sample}
              </Heading>
            </Specimen>
          ))}

          <Specimen
            name="className override"
            spec="font-bold sobre title.3 — el peso no viene del variant"
          >
            <Heading as="h4" variant="title.3" className="font-bold">
              Parker Solar Probe
            </Heading>
          </Specimen>
        </Section>

        <Section id="text" title="Text" description="shared/components/text · variant">
          {TEXTS.map((text) => (
            <Specimen key={text.variant} name={`variant="${text.variant}"`} spec={text.spec}>
              <Text variant={text.variant} className="max-w-[65ch]">
                {text.sample}
              </Text>
            </Specimen>
          ))}
        </Section>

        <Section
          id="buttons"
          title="Buttons"
          description="shared/components/button · variant × size × state"
        >
          {BUTTON_VARIANTS.map((variant) => (
            <Specimen key={variant} name={`variant="${variant}"`} spec="todos los size">
              <div className="flex flex-wrap items-center gap-3">
                {BUTTON_SIZES.map((size) => (
                  <Button key={size} variant={variant} size={size}>
                    {size}
                  </Button>
                ))}
              </div>
            </Specimen>
          ))}

          <Specimen name="states" spec="default · disabled · loading">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="md">
                Explore more
              </Button>
              <Button variant="primary" size="md" disabled>
                Disabled
              </Button>
              <Button variant="primary" size="md" loading>
                Explore more
              </Button>
            </div>
            <Text variant="body.3" className="mt-3 text-basic-900/45">
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
            <Button asChild variant="primary" size="md">
              <a href="#buttons">Link as button</a>
            </Button>
          </Specimen>

          <Specimen name='size="auto"' spec="w-auto">
            <Button variant="primary" className="gap-2">
              Explore more
              <ArrowRight className="size-5" />
            </Button>
            <Button variant="text-link" size="md" className="gap-2">
              VIEW ALL ARCHIVES
              <ArrowRight className="size-5" />
            </Button>
          </Specimen>
        </Section>

        <Section
          id="icons"
          title="Icons"
          description="shared/components/icons · fill=currentColor, 24×24"
        >
          <Specimen name="className" spec="el color se pasa con una utility text-*">
            <div className="flex items-center gap-10">
              <Icons className="text-blue-700" />
            </div>
          </Specimen>
        </Section>

        <Section
          id="colors"
          title="Colors"
          description="shared/styles/foundations/colors.css · semantic-tokens/colors.css"
        >
          {COLOR_GROUPS.map((group) => (
            <Specimen key={group.name} name={group.name} spec="foundation → utility" stack>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {group.tokens.map((swatch) => (
                  <Swatch
                    key={swatch.label}
                    label={swatch.label}
                    className={swatch.className}
                    token={swatch.token}
                    hex={swatch.hex}
                  />
                ))}
              </div>
            </Specimen>
          ))}
        </Section>
      </main>
    </div>
  )
}

export default Page
