import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { courses } from "@/lib/courses";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const STORAGE_KEY = "kb:onboarding";

export interface Onboarding {
  /** true — знает какой-то язык, false — новичок. */
  knows: boolean;
  /** Слаг выбранного курса (для knows=true). */
  lang?: string;
}

export function loadOnboarding(): Onboarding | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Onboarding;
    if (typeof parsed.knows !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveOnboarding(value: Onboarding) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

/**
 * Опрос перед стартом обучения: «Знаете ли вы какой-либо язык программирования?»
 * «Нет» → стартовый трек с нуля (HTML-курс первым).
 * «Да» → выбор известного языка из 5 курсов; раскладка уроков подстраивается автоматически.
 */
export function OnboardingDialog({
  open,
  onOpenChange,
  onDone,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState<"question" | "langs">("question");
  const [answeredKnows, setAnsweredKnows] = useState<boolean | null>(null);

  const answer = (knows: boolean) => {
    setAnsweredKnows(knows);
    if (knows) {
      setStep("langs");
    } else {
      // Новичок: трек с нуля, HTML-курс первым.
      saveOnboarding({ knows: false, lang: courses[0].slug });
      onOpenChange(false);
      onDone();
    }
  };

  const pickLang = (slug: string) => {
    saveOnboarding({ knows: true, lang: slug });
    onOpenChange(false);
    onDone();
  };

  const reset = () => {
    setStep("question");
    setAnsweredKnows(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-lg gap-0 overflow-hidden border-border/60 bg-card p-0">
        <div className="border-b border-border/60 bg-editor-gutter/50 px-5 py-2.5 font-editor text-[11px] text-muted-foreground">
          setup --onboarding <span className="animate-blink">▍</span>
        </div>

        {step === "question" ? (
          <div className="p-5">
            <DialogHeader className="text-left">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="size-5 text-primary" />
                Знаете ли вы какой-либо язык программирования?
              </DialogTitle>
              <DialogDescription className="pt-1 text-sm leading-6">
                Ответьте честно — от этого зависит, с какого курса начнётся ваше
                обучение. Изменить ответ можно в любой момент.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                variant={answeredKnows === false ? "default" : "outline"}
                className="h-auto flex-col gap-1 py-4 font-editor"
                onClick={() => answer(false)}
              >
                <span className="text-base">Нет</span>
                <span className="text-xs font-normal text-muted-foreground">
                  начну с самых основ
                </span>
              </Button>
              <Button
                variant={answeredKnows === true ? "default" : "outline"}
                className="h-auto flex-col gap-1 py-4 font-editor"
                onClick={() => answer(true)}
              >
                <span className="text-base">Да</span>
                <span className="text-xs font-normal text-muted-foreground">
                  выберу знакомый язык
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <DialogHeader className="text-left">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="size-5 text-primary" />
                Какой язык вы знаете?
              </DialogTitle>
              <DialogDescription className="pt-1 text-sm leading-6">
                Выберите язык — и программа уроков подстроится автоматически.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 grid gap-2">
              {courses.map((c) => (
                <motion.button
                  key={c.slug}
                  type="button"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => pickLang(c.slug)}
                  className="group flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3 text-left transition-colors hover:border-primary/50"
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-md font-editor text-xs font-bold"
                    style={{ backgroundColor: `${c.accent}22`, color: c.accent }}
                  >
                    {c.langName.slice(0, 2)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{c.langName}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {c.tagline}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                </motion.button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setStep("question");
                setAnsweredKnows(null);
              }}
              className="mt-4 font-editor text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              ← я всё-таки новичок
            </button>
          </div>
        )}

        <div className="flex items-center gap-1.5 border-t border-border/60 px-5 py-2.5 font-editor text-[11px] text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-primary" />
          ответ сохраняется автоматически
        </div>
      </DialogContent>
    </Dialog>
  );
}
