import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

/** Вордмарк soogy: знак + название с градиентным акцентом на второй половине. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Logo />
      <span className="font-editor text-sm font-semibold tracking-tight">
        soo
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          gy
        </span>
      </span>
    </span>
  );
}
