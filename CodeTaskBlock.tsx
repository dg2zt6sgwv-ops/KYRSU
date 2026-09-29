import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CodeTask, VerificationResult } from "@/lib/course-content";
import { verifyCodeTask } from "@/lib/verifier";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Eye,
  Loader2,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface Tab {
  id: string;
  label: string;
}

export function CodeTaskBlock({
  task,
  lessonSlug,
  onPassed,
}: {
  task: CodeTask;
  lessonSlug: string;
  onPassed: () => void;
}) {
  const isText = (task.mode ?? "dom") === "text";

  const tabs: Tab[] = useMemo(
    () =>
      isText
        ? (task.files ?? []).map((f) => ({ id: f.id, label: f.label }))
        : [
            { id: "html", label: "index.html" },
            { id: "css", label: "styles.css" },
            { id: "js", label: "script.js" },
          ],
    [isText, task.files],
  );

  const storageKey = `code-draft:${lessonSlug}`;
  const [code, setCode] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, string>;
        if (isText) {
          return Object.fromEntries(
            tabs.map((t) => [
              t.id,
              parsed[t.id] ?? task.files?.find((f) => f.id === t.id)?.starter ?? "",
            ]),
          );
        }
        return {
          html: parsed.html ?? task.starterHtml ?? "",
          css: parsed.css ?? task.starterCss ?? "",
          js: parsed.js ?? task.starterJs ?? "",
        };
      }
    } catch {
      // ignore broken drafts
    }
    if (isText) {
      return Object.fromEntries((task.files ?? []).map((f) => [f.id, f.starter]));
    }
    return {
      html: task.starterHtml ?? "",
      css: task.starterCss ?? "",
      js: task.starterJs ?? "",
    };
  });
  const [active, setActive] = useState<string>(tabs[0]?.id ?? "html");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const passedNotified = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(code));
    } catch {
      // quota errors are fine to ignore
    }
  }, [code, storageKey]);

  useEffect(() => {
    passedNotified.current = false;
  }, [task]);

  const setPane = (pane: string, value: string) =>
    setCode((c) => ({ ...c, [pane]: value }));

  const handleRun = async () => {
    setIsChecking(true);
    const res = await verifyCodeTask(task, code);
    setResult(res);
    setIsChecking(false);
    if (res.passed && !passedNotified.current) {
      passedNotified.current = true;
      onPassed();
    }
  };

  const handleReset = () => {
    if (isText) {
      setCode(Object.fromEntries((task.files ?? []).map((f) => [f.id, f.starter])));
    } else {
      setCode({
        html: task.starterHtml ?? "",
        css: task.starterCss ?? "",
        js: task.starterJs ?? "",
      });
    }
    setResult(null);
  };

  const allPassed = result?.passed ?? false;

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-border/60 bg-card p-4 text-sm leading-6 text-foreground/90">
        <span className="mr-2 font-editor text-primary">$ задача</span>
        {task.instruction}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Редактор */}
        <div className="overflow-hidden rounded-lg border border-border/60 bg-editor-window">
          <div className="flex items-center justify-between border-b border-border/60 px-2 py-1.5">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActive(t.id)}
                  className={cn(
                    "rounded-md px-2.5 py-1 font-editor text-[11px] whitespace-nowrap transition-colors",
                    active === t.id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleReset}
              title="Сбросить к исходному коду"
              className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
          <textarea
            value={code[active] ?? ""}
            onChange={(e) => setPane(active, e.target.value)}
            spellCheck={false}
            className="h-72 w-full resize-y bg-transparent p-4 font-editor text-[13px] leading-6 text-foreground outline-none lg:h-80"
          />
        </div>

        {/* Превью / вывод */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-border/60 bg-editor-window">
          <div className="flex items-center justify-between border-b border-border/60 px-3 py-1.5">
            <span className="font-editor text-[11px] text-muted-foreground">
              {isText ? "консоль" : "браузер"}
            </span>
            <button
              type="button"
              onClick={() => setShowPreview((s) => !s)}
              className="font-editor text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPreview ? "скрыть" : "показать"}
            </button>
          </div>
          {isText ? (
            <div className="flex h-72 flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-xs text-muted-foreground lg:h-80">
              <span className="font-editor text-primary">$ run {tabs[0]?.label ?? ""}</span>
              <span className="max-w-xs leading-5">
                Автопроверка разберёт ваш исходный код по пунктам — «консольный»
                запуск не нужен: результат появится в отчёте ниже после нажатия
                «Проверить код».
              </span>
            </div>
          ) : showPreview ? (
            <LivePreview html={code.html ?? ""} css={code.css ?? ""} js={code.js ?? ""} />
          ) : (
            <div className="flex h-72 flex-1 items-center justify-center p-6 text-center text-xs text-muted-foreground lg:h-80">
              Превью скрыто. Нажмите «Показать», чтобы увидеть страницу.
            </div>
          )}
        </div>
      </div>

      {/* Действия */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          className="gap-1.5"
          onClick={handleRun}
          disabled={isChecking}
        >
          {isChecking ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Play className="size-3.5" />
          )}
          {isChecking ? "Проверяю…" : "Проверить код"}
        </Button>
        {!isText && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setShowPreview((s) => !s)}
          >
            <Eye className="size-3.5" />
            {showPreview ? "Скрыть превью" : "Показать превью"}
          </Button>
        )}
        {allPassed && (
          <span className="flex items-center gap-1.5 font-editor text-sm text-primary">
            <CheckCircle2 className="size-4" />
            задание сдано
          </span>
        )}
      </div>

      {/* Результат проверки */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "rounded-lg border p-4",
              result.passed
                ? "border-primary/40 bg-primary/5"
                : "border-border/60 bg-card",
            )}
          >
            <p className="mb-3 font-editor text-sm">
              <span
                className={result.passed ? "text-primary" : "text-muted-foreground"}
              >
                {result.passed ? "✓ " : "! "}
              </span>
              {result.message}
            </p>
            <ul className="flex flex-col gap-1.5">
              {result.checks.map((c) => (
                <li key={c.id} className="flex items-start gap-2 text-sm">
                  {c.pass ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  ) : (
                    <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  )}
                  <span>
                    <span className="font-medium">{c.title}</span>
                    {" — "}
                    <span className="text-muted-foreground">{c.message}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Debounced live preview of the learner's code. */
function LivePreview({
  html,
  css,
  js,
}: {
  html: string;
  css: string;
  js: string;
}) {
  const [doc, setDoc] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDoc(
        `<!doctype html><html><head><style>${css}\nbody{margin:0;}</style></head><body>${html}` +
          `<script>try{\n${js}\n}catch(e){}<\/script></body></html>`,
      );
    }, 400);
    return () => clearTimeout(t);
  }, [html, css, js]);

  return (
    <iframe
      title="Превью"
      sandbox="allow-scripts allow-same-origin"
      className="h-72 w-full lg:h-80"
      srcDoc={doc}
    />
  );
}
