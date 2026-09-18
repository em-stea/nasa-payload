"use client";

import {useState} from "react";

import {Share} from "@/shared/components/icons/other/share";
import {Text} from "@/shared/components/text/text";

type ShareButtonProps = {
  url: string;
  title: string;
  withLabel?: boolean;
};

export function ShareButton({url, title, withLabel = false}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const target = new URL(url, window.location.origin).toString();

    await navigator.clipboard.writeText(target).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      aria-label={copied ? "Link copiado" : `Compartir: ${title}`}
      className="flex items-center gap-2 text-secondary-foreground transition-colors duration-200 hover:cursor-pointer hover:text-foreground"
      type="button"
      onClick={handleShare}
    >
      <Share aria-hidden="true" className="size-6 shrink-0" />
      {withLabel && (
        <span className="relative hidden sm:inline-grid">
          <Text
            aria-hidden="true"
            className="invisible col-start-1 row-start-1 uppercase"
            variant="meta.3"
          >
            Copied
          </Text>
          <Text className="col-start-1 row-start-1 uppercase" variant="meta.3">
            {copied ? "Copied" : "Share"}
          </Text>
        </span>
      )}
    </button>
  );
}
