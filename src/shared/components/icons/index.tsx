import { ArrowRight } from './directional/arrow-right'
import { User } from './other/user'
import { CheckCircle } from './feedback/check-circle'
import { Cross } from './feedback/cross'
import { Logout } from './other/logout'
import { ChevronLeft } from './directional/chevron-left'
import { ChevronRight } from './directional/chevron-right'
import { Github } from './social-media/github'
import { Google } from './social-media/google'
import { EyeClosed } from './other/eye-closed'
import { Eye } from './other/eye'
import { Login } from './other/login'
import { Moon } from './other/moon'
import { Heart } from './other/heart'
import { Comments } from './other/comments'
import { Bell } from './other/bell'
import { Settings } from './other/settings'
import { Account } from './other/account'
import { Menu } from './other/menu'
import { Live } from './other/live'
import { Share } from './other/share'
import { ChartLine } from './other/chart-line'
import { Cube } from './other/cube'
import { Target } from './other/target'
import { WarningTriangle } from './feedback/warning-triangle'

const IconsType = {
  directional: {
    arrowRight: ArrowRight,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
  },
  other: {
    user: User,
    logout: Logout,
    login: Login,
    eyeClosed: EyeClosed,
    eye: Eye,
    moon: Moon,
    heart: Heart,
    comments: Comments,
    bell: Bell,
    settings: Settings,
    account: Account,
    menu: Menu,
    share: Share,
    live: Live,
    chartLine: ChartLine,
    cube: Cube,
    target: Target,
  },
  feedback: {
    cross: Cross,
    checkCircle: CheckCircle,
    warningTriangle: WarningTriangle,
  },
  socialMedia: {
    google: Google,
    github: Github,
  },
}

interface IconsProps {
  className?: string
}

export const Icons = ({ className }: IconsProps) => {
  return (
    <>
      {Object.entries(IconsType).map(([category, icons]) => (
        <div key={category} className="my-8 flex flex-col gap-2">
          <h3 className="border-b border-black/20 text-base font-medium tracking-wider uppercase">
            {category}
          </h3>
          <div className="flex flex-row gap-4 align-middle">
            {Object.entries(icons).map(([name, Icon]) => (
              <Icon key={name} className={className} />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
