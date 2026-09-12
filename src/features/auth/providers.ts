import { Github } from '@/shared/components/icons/social-media/github'
import { Google } from '@/shared/components/icons/social-media/google'

import type { ComponentProps, ReactNode } from 'react'

export type AuthProviderId = 'google' | 'github'

export type AuthProviderOption = {
  id: AuthProviderId
  label: string
  icon: (props: ComponentProps<'svg'>) => ReactNode
}

/** Providers OAuth habilitados, en el orden en que se muestran en la UI. */
export const AUTH_PROVIDERS: AuthProviderOption[] = [
  { id: 'google', label: 'Continue with Google', icon: Google },
  { id: 'github', label: 'Continue with GitHub', icon: Github },
]
