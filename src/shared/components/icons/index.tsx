import {ArrowRight} from "./directional/arrow-right";
import {ChevronLeft} from "./directional/chevron-left";
import {ChevronRight} from "./directional/chevron-right";
import {CheckCircle} from "./feedback/check-circle";
import {Cross} from "./feedback/cross";
import {WarningTriangle} from "./feedback/warning-triangle";
import {Account} from "./other/account";
import {Bell} from "./other/bell";
import {ChartLine} from "./other/chart-line";
import {Comments} from "./other/comments";
import {Cube} from "./other/cube";
import {Eye} from "./other/eye";
import {EyeClosed} from "./other/eye-closed";
import {Heart} from "./other/heart";
import {Live} from "./other/live";
import {Login} from "./other/login";
import {Logout} from "./other/logout";
import {Menu} from "./other/menu";
import {Moon} from "./other/moon";
import {Settings} from "./other/settings";
import {Share} from "./other/share";
import {Target} from "./other/target";
import {User} from "./other/user";
import {Github} from "./social-media/github";
import {Google} from "./social-media/google";

export {ArrowRight} from "./directional/arrow-right";
export {ChevronLeft} from "./directional/chevron-left";
export {ChevronRight} from "./directional/chevron-right";
export {CheckCircle} from "./feedback/check-circle";
export {Cross} from "./feedback/cross";
export {WarningTriangle} from "./feedback/warning-triangle";
export {Account} from "./other/account";
export {Bell} from "./other/bell";
export {ChartLine} from "./other/chart-line";
export {Comments} from "./other/comments";
export {Cube} from "./other/cube";
export {Eye} from "./other/eye";
export {EyeClosed} from "./other/eye-closed";
export {Heart} from "./other/heart";
export {Live} from "./other/live";
export {Login} from "./other/login";
export {Logout} from "./other/logout";
export {Menu} from "./other/menu";
export {Moon} from "./other/moon";
export {Settings} from "./other/settings";
export {Share} from "./other/share";
export {Target} from "./other/target";
export {User} from "./other/user";
export {Github} from "./social-media/github";
export {Google} from "./social-media/google";

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
};

interface IconsProps {
  className?: string;
}

export const Icons = ({className}: IconsProps) => {
  return (
    <>
      {Object.entries(IconsType).map(([category, icons]) => (
        <div className="my-8 flex flex-col gap-2" key={category}>
          <h3 className="border-b border-black/20 text-base font-medium tracking-wider uppercase">
            {category}
          </h3>
          <div className="flex flex-row gap-4 align-middle">
            {Object.entries(icons).map(([name, Icon]) => (
              <Icon className={className} key={name} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
