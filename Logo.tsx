import { cn } from "@/lib/utils";

/**
 * Знак soogy: градиентная «клавиша» с терминальным промптом ❯_
 * и мягким свечением — в тему тёмного редактора кода.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-8 select-none items-center justify-center overflow-hidden rounded-[10px] bg-gradient-to-br from-primary via-primary to-primary/55 shadow-[0_0_20px_-6px_var(--primary)] ring-1 ring-inset ring-white/20",
        className,
      )}
      aria-hidden
    >
      {/* блик сверху для «стеклянной» глубины */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
      <span className="relative font-editor text-[13px] leading-none font-bold text-primary-foreground">
        ❯<span className="animate-blink">_</span>
      </span>
    </span>
  );
}
