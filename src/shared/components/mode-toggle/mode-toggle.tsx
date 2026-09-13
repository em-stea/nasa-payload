"use client";

import {Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";

import {Button} from "../button/button";

export function ModeToggle() {
  const {resolvedTheme, setTheme} = useTheme();

  return (
    <div className="flex size-30 flex-col gap-2">
      <Button
        className="p-4"
        size="intrinsic"
        variant="ghost"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <Sun className="size-5 text-primary-foreground dark:hidden" />
        <Moon className="hidden size-5 text-primary-foreground dark:block" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
