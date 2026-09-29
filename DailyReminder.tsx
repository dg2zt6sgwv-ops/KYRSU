import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { allLessons } from "@/lib/course-content";
import type { Lesson } from "@/lib/course-content";
import { courses, nextUnfinishedLesson } from "@/lib/courses";
import { cn } from "@/lib/utils";
import { Bell, BellOff, BellRing } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const REMIND_TIME = "16:30";
const TIME_H = 16;
const TIME_M = 30;
const KEY = "soogy:reminder";
const DONE_KEY = "soogy:reminder-done";

function todayKey(): string {
  const d = new  Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function loadReminder(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function saveReminder(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    // ignore
  }
}

/** Урок дня: первый незавершённый из трека пользователя. */
function pickDailyLesson(lessonSlugs: string[]): Lesson | null {
  const onboardingRaw = (() => {
    try {
      return JSON.parse(localStorage.getItem("kb:onboarding") ?? "null") as
        | { knows?: boolean; lang?: string }
        | null;
    } catch {
      return null;
    }
  })();
  const track = courses.find((c) => c.slug === onboardingRaw?.lang) ?? courses[0];
  const all = allLessons(track);
  const next = nextUnfinishedLesson(track, lessonSlugs);
  return next ?? all[0] ?? null;
}

/**
 * Ежедневное напоминание: браузерное уведомление в 16:30 (пока вкладка открыта)
 * и мягкий баннер «урок дня» на дашборде.
 */
export function DailyReminder({ lessonSlugs }: { lessonSlugs: string[] }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(loadReminder);
  const [now, setNow] = useState(() => new Date());
  const firedRef = useRef<string | null>(null);

  // Пульс каждую минуту: в 16:30 (и позже, до конца дня, если окно было закрыто)
  // показываем уведомление один раз в день.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const d = now;
    const past = d.getHours() > TIME_H || (d.getHours() === TIME_H && d.getMinutes() >= TIME_M);
    const key = todayKey();
    let done = false;
    try {
      done = localStorage.getItem(DONE_KEY) === key;
    } catch {
      // ignore
    }
    if (past && !done && firedRef.current !== key) {
      firedRef.current = key;
      try {
        localStorage.setItem(DONE_KEY, key);
      } catch {
        // ignore
      }
      const lesson = pickDailyLesson(lessonSlugs);
      const name = lesson?.title ?? "сегодняшний урок";
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        const n = new Notification("soogy · время урока!", {
          body: `16:30 — ваше ежедневное время. Продолжите: ${name}`,
          tag: "soogy-daily",
        });
        n.onclick = () => window.focus();
      }
      toast(`🔔 16:30 — время урока!`, {
        description: name,
        action: {
          label: "Продолжить",
          onClick: () => {
            const daily = pickDailyLesson(lessonSlugs);
            if (daily) navigate(`/lesson/${daily.slug}`);
          },
        },
      });
    }
  }, [enabled, now, lessonSlugs, navigate]);

  const toggle = async (on: boolean) => {
    setEnabled(on);
    saveReminder(on);
    if (on && typeof Notification !== "undefined" && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {
        // ignore
      }
    }
    if (on) {
      const lesson = pickDailyLesson(lessonSlugs);
      toast.success(`Напоминание включено: каждый день в ${REMIND_TIME}`, {
        description: lesson
          ? `Следующий урок: «${lesson.title}»`
          : "Урок подберётся автоматически",
      });
    }
  };

  const daily = pickDailyLesson(lessonSlugs);
  const isGuest = user?.isAnonymous === true;
  const greeting = isGuest ? "Гость" : user?.name ?? user?.email ?? "Ученик";

  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              enabled ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            {enabled ? <BellRing className="size-4" /> : <BellOff className="size-4" />}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">
              Напоминание в {REMIND_TIME}
            </p>
            <p className="text-xs text-muted-foreground">
              {enabled
                ? "Каждый день напомним о вашем уроке"
                : "Включите — и каждый день в 16:30 напомним об уроке"}
            </p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={toggle} aria-label="Включить напоминание" />
      </div>

      {enabled && daily && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-editor-gutter/30 p-4">
          <p className="min-w-0 text-xs text-muted-foreground">
            <span className="font-editor text-primary">урок дня</span>{" "}
            <span className="text-foreground">«{daily.title}»</span> · {daily.minutes} мин
          </p>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 font-editor text-xs"
            onClick={() => navigate(`/lesson/${daily.slug}`)}
          >
            <Bell className="size-3.5" />
            Начать сегодня
          </Button>
        </div>
      )}
    </div>
  );
}
