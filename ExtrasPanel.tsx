import { Button } from "@/components/ui/button";
import { CodeTaskBlock } from "@/components/CodeTaskBlock";
import { extraTasks } from "@/lib/extras";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function ExtraCard({
  extra,
  done,
  onPass,
}: {
  extra: (typeof extraTasks)[number];
  done: boolean;
  onPass: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card transition-colors",
        done ? "border-primary/40" : "border-border/60",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/40"
      >
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-md font-editor text-xs font-bold"
          style={{ backgroundColor: `${extra.accent}22`, color: extra.accent }}
        >
          {extra.langName.slice(0, 2)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-medium">{extra.title}</span>
            {done && (
              <CheckCircle2 className="size-4 shrink-0 text-primary" />
            )}
          </span>
          <span className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" /> ~{extra.minutes} мин
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="size-3" /> +10 XP
            </span>
            <span className="font-editor">{extra.langName}</span>
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-border/60 p-4"
        >
          <CodeTaskBlock
            task={extra.task}
            lessonSlug={`extra:${extra.id}`}
            onPassed={() => {
              if (!done) {
                onPass();
                toast.success("Доп. задание сдано: +10 XP ✨");
              }
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Раздел «Дополнительные задания»: лёгкие разминки и мини-задачи.
 * Домашние задания живут внутри уроков — здесь только добровольная практика.
 */
export function ExtrasPanel({ extraSlugs }: { extraSlugs: string[] }) {
  const completeExtra = useMutation(api.progress.completeExtra);

  const handlePass = (id: string) => {
    completeExtra({ extraId: id }).catch(() => {
      // даже при ошибке сети — прогресс доп. задания не критичен
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-border/60 bg-editor-gutter/30 p-4 text-sm text-muted-foreground">
        <span className="mr-2 font-editor text-primary">$ extra --свои-темп</span>
        Лёгкие задания на закрепление: без дедлайнов, можно решать в любой
        момент. Домашние задания — внутри уроков.
      </div>

      {extraTasks.map((extra, i) => (
        <motion.div
          key={extra.id}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.25, delay: i * 0.03 }}
        >
          <ExtraCard
            extra={extra}
            done={extraSlugs.includes(extra.id)}
            onPass={() => handlePass(extra.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}
