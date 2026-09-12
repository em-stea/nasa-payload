// src/common/utils/tw-merge/index.ts
import { extendTailwindMerge } from 'tailwind-merge'

import { tailwindMergeConfig } from './generated-config'

const twMergeConfig = tailwindMergeConfig

const twMerge = extendTailwindMerge(twMergeConfig)

export { twMerge }
