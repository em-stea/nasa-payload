import { ArrowRight } from './directional/arrow-right'
import { User } from './other/user'
import { Cross } from './feedback/cross'
import { Logout } from './other/logout'
import { ChevronLeft } from './directional/chevron-left'
import { ChevronRight } from './directional/chevron-right'
import { Google } from './social-media/google'
import { EyeClosed } from './other/eye-closed'
import { Eye } from './other/eye'
import { Login } from './other/login'

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
  },
  feedback: {
    cross: Cross,
  },
  socialMedia: {
    google: Google,
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
