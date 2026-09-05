import { Comic_Neue, Titan_One, VT323 } from 'next/font/google'

const display = Titan_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
})

const sans = Comic_Neue({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
})

const mono = VT323({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
})

const SOON = 'PRÓXIMAMENTE'.split('')

const FLOATERS = [
  { emoji: '🛸', className: 'nasa-floater--a' },
  { emoji: '👽', className: 'nasa-floater--b' },
  { emoji: '🪐', className: 'nasa-floater--c' },
  { emoji: '☄️', className: 'nasa-floater--d' },
  { emoji: '🌚', className: 'nasa-floater--e' },
  { emoji: '🛰️', className: 'nasa-floater--f' },
]

const TICKER =
  '🚀 BIENVENIDO A MI PÁGINA ESPACIAL 👨‍🚀 SITIO EN CONSTRUCCIÓN 🚧 NO TOCAR LOS BOTONES 🛸 EL ASTRONAUTA BAILA GRATIS 🪐 '

export default function HomePage() {
  return (
    <main
      className={`${display.variable} ${sans.variable} ${mono.variable} nasa-space relative flex min-h-dvh flex-col overflow-hidden`}
    >
      <div className="nasa-stars" aria-hidden />
      <div className="nasa-stars nasa-stars--far" aria-hidden />
      <div className="nasa-nebula" aria-hidden />
      <div className="nasa-shooting" aria-hidden />

      <div className="nasa-ticker" aria-hidden>
        <div className="nasa-ticker__track">
          <span>{TICKER}</span>
          <span>{TICKER}</span>
        </div>
      </div>

      <div className="nasa-floaters" aria-hidden>
        {FLOATERS.map(({ emoji, className }) => (
          <span key={emoji} className={`nasa-floater ${className}`}>
            {emoji}
          </span>
        ))}
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-8 px-5 py-12 text-center">
        <p className="nasa-blink text-sm tracking-[0.3em] text-[#39ff7d] uppercase">
          ★ Bienvenido ★
        </p>

        <h1 className="nasa-title">
          <span>Blog de la NASA</span>
        </h1>

        <p className="max-w-lg text-lg leading-snug font-bold text-[#ffe9a8] sm:text-xl">
          Noticias del espacio, misiones y cosas que giran muy rápido allá arriba.
        </p>

        <div className="nasa-astro-stage">
          <div className="nasa-astro" aria-label="Astronauta bailando" role="img">
            <span className="nasa-astro__arm nasa-astro__arm--l" />
            <span className="nasa-astro__arm nasa-astro__arm--r" />
            <span className="nasa-astro__leg nasa-astro__leg--l" />
            <span className="nasa-astro__leg nasa-astro__leg--r" />
            <span className="nasa-astro__pack" />
            <span className="nasa-astro__body">
              <span className="nasa-astro__patch" />
            </span>
            <span className="nasa-astro__head">
              <span className="nasa-astro__antenna" />
              <span className="nasa-astro__visor">
                <span className="nasa-astro__shine" />
              </span>
            </span>
          </div>
          <div className="nasa-disco" aria-hidden />
        </div>

        <h2 className="nasa-soon" aria-label="Próximamente">
          {SOON.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              aria-hidden
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {letter}
            </span>
          ))}
        </h2>

        <div className="nasa-badges">
          <span className="nasa-badge nasa-badge--construction">🚧 EN OBRA 🚧</span>
          <span className="nasa-badge nasa-badge--best">MEJOR VISTO EN NETSCAPE</span>
          <span className="nasa-badge nasa-badge--ufo">👽 APROBADO POR MARCIANOS</span>
        </div>

        <div className="nasa-counter">
          <span className="nasa-counter__label">Visitantes terrestres:</span>
          <span className="nasa-counter__digits">
            {'0042069'.split('').map((digit, index) => (
              <span key={`${digit}-${index}`}>{digit}</span>
            ))}
          </span>
        </div>
      </section>

      <footer className="relative z-10 pb-6 text-center text-sm text-[#8fd0ff]">
        <span className="nasa-blink">●</span> Transmitiendo desde algún lugar de la Vía Láctea
      </footer>
    </main>
  )
}
