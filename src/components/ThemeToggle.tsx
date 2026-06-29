"use client";

import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import { setUiMode } from "@/lib/ui-mode";

/** Switches the classic (shadcn) shell over to the Ionic iOS theme. */
export default function ThemeToggle() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={() => setUiMode("ios")}
      aria-label="Switch to iOS theme"
    >
      <Smartphone className="size-4" />
      <span className="max-sm:hidden">iOS UI</span>
    </Button>
  );
}
