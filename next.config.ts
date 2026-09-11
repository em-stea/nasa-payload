import { FRONT_ENV } from '@/shared/config/front-config'
import { withTailwindMergeConfig } from '@/shared/utils/tw-merge/helpers/helpers'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  ...(FRONT_ENV.NEXT_PUBLIC_ENVIRONMENT === 'local' && {
    onDemandEntries: {
      maxInactiveAge: 60 * 1000,
      pagesBufferLength: 2,
    },
  }),
}

export default withTailwindMergeConfig(withPayload(nextConfig, { devBundleServerPackages: false }))
