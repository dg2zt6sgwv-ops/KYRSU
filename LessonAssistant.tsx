import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Bot,
  CornerDownLeft,
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAction } from "convex/react";
import { toast } from "sonner";

const MAX_QUESTIONS = 5;

interface Msg {
  role: "user" | "assistant";
  content: string;
}

/**
 * Сетевой помощник урока: ИИ-чат с лимитом 5 вопросов на урок.
 * Лимит показывается снизу окна («осталось N из 5»), чтобы не было
 * путаницы, а ответы ИИ дополняли курс, а не заменяли его.
 */
export function LessonAssistant({
  lessonSlug,
  lessonTitle,
  courseLang,
  taskInstruction,
}: {
  lessonSlug: string;
  lessonTitle: string;
  courseLang: string;
  taskInstruction?: string;
}) {
  const ask = useAction(api.ai.ask);

  const storageKey = `kb:assistant:${lessonSlug}`;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [used, setUsed] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as number) : 0;
    } catch {
      return 0;
    }
  });
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(used));
    } catch {
      // ignore quota errors
    }
  }, [used, storageKey]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, open]);

  const remaining = MAX_QUESTIONS - used;
  const limitReached = remaining <= 0;

  const send = async () => {
    const question = input.trim();
    if (!question || busy || limitReached) return;
    const nextUsed = used + 1;
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: question }]);
    setBusy(true);
    try {
      const res = await ask({
        question,
        history: msgs.map((m) => ({ role: m.role, content: m.content })),
        lessonTitle,
        courseLang,
        taskInstruction,
      });
      if (res.ok) {
        setMsgs((m) => [...m, { role: "assistant", content: res.answer }]);
        setUsed(nextUsed);
      } else {
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content: `Не получилось ответить: ${res.error}. Попробуйте ещё раз.`,
          },
        ]);
      }
    } catch {
      toast.error("Помощник недоступен. Попробуйте позже.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-[26rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border/60 bg-editor-window shadow-2xl shadow-black/40"
        >
          {/* Шапка */}
          <div className="flex items-center gap-2 border-b border-border/60 bg-editor-gutter/60 px-3 py-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Bot className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-editor text-xs font-semibold">сетевой помощник</p>
              <p className="truncate font-editor text-[10px] text-muted-foreground">
                {courseLang} · {lessonTitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              title="Свернуть"
              className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Сообщения */}
          <div
            ref={listRef}
            className="flex-1 space-y-2.5 overflow-y-auto p-3 text-sm"
          >
            {msgs.length === 0 && (
              <div className="rounded-lg border border-border/60 bg-card p-3 text-xs leading-5 text-muted-foreground">
                Привет! Я отвечаю на вопросы по этому уроку и основам{" "}
                {courseLang}. Спросите, например: «как пишется оператор
                сравнения?». Вопросов на урок — {MAX_QUESTIONS}.
              </div>
            )}
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 leading-5",
                  m.role === "user"
                    ? "ml-auto bg-primary/15 text-foreground"
                    : "border border-border/60 bg-card text-foreground/90",
                )}
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 px-1 font-editor text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" /> помощник печатает…
              </div>
            )}
          </div>

          {/* Ввод + лимит */}
          <div className="border-t border-border/60 p-2.5">
            {limitReached ? (
              <p className="py-2 text-center font-editor text-xs text-muted-foreground">
                Лимит вопросов на этот урок израсходован ({MAX_QUESTIONS} из{" "}
                {MAX_QUESTIONS}). На следующем уроке — снова {MAX_QUESTIONS}.
              </p>
            ) : (
              <div className="flex items-end gap-1.5">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  rows={2}
                  placeholder="Спросите про урок…"
                  className="max-h-24 flex-1 resize-none rounded-md border border-border/60 bg-background p-2 font-editor text-xs leading-5 outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
                />
                <Button
                  size="icon-sm"
                  onClick={() => void send()}
                  disabled={busy || !input.trim()}
                  title="Отправить (Enter)"
                >
                  {busy ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                </Button>
              </div>
            )}
            {/* Лимит вопросов — написан снизу */}
            <p className="mt-1.5 flex items-center gap-1.5 px-1 font-editor text-[10px] text-muted-foreground">
              <MessageCircle className="size-3 text-primary" />
              {remaining > 0
                ? `осталось вопросов: ${remaining} из ${MAX_QUESTIONS}`
                : "вопросов больше нет — до следующего урока"}
              <span className="ml-auto flex items-center gap-0.5 opacity-60">
                Enter <CornerDownLeft className="size-2.5" />
              </span>
            </p>
          </div>
        </motion.div>
      )}

      {/* Кнопка открытия */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2.5 font-editor text-xs shadow-lg shadow-black/30 transition-colors",
          open
            ? "border-border/60 bg-card text-muted-foreground hover:text-foreground"
            : "border-primary/40 bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        {open ? (
          "свернуть помощника"
        ) : (
          <>
            <Bot className="size-4" />
            помощник
            {!limitReached && remaining < MAX_QUESTIONS && (
              <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-[10px]">
                {remaining}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}
