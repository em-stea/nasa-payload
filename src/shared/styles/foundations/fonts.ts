import localFont from 'next/font/local'

export const SpaceGrotesk = localFont({
  src: [
    {
      path: '../../../../public/fonts/SpaceGrotesk-Regular.woff2',
      weight: '400',
    },
    {
      path: '../../../../public/fonts/SpaceGrotesk-Medium.woff2',
      weight: '500',
    },
    {
      path: '../../../../public/fonts/SpaceGrotesk-SemiBold.woff2',
      weight: '600',
    },
    {
      path: '../../../../public/fonts/SpaceGrotesk-Bold.woff2',
      weight: '700',
    },
  ],
  variable: '--font-primary',
})

export const JetBrainsMono = localFont({
  src: [
    {
      path: '../../../../public/fonts/JetBrainsMono-Regular.woff2',
      weight: '400',
    },
    {
      path: '../../../../public/fonts/JetBrainsMono-Bold.woff2',
      weight: '700',
    },
  ],
  variable: '--font-secondary',
})
