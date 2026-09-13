import type {DetailedHTMLProps, HTMLAttributes} from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      /** Custom element de `lite-youtube-embed`, ver `features/live/components/live-player`. */
      "lite-youtube": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        videoid: string;
        playlabel?: string;
        params?: string;
      };
    }
  }
}
