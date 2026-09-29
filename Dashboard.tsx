import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/SiteHeader";
import { DailyReminder } from "@/components/DailyReminder";
import { ExtrasPanel } from "@/components/ExtrasPanel";
import {
  OnboardingDialog,
  loadOnboarding,
  saveOnboarding,
} from "@/components/OnboardingDialog";
import { courses, nextUnfinishedLesson } from "@/lib/courses";
import { allLessons } from "@/lib/course-content";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Circle,
  Clock,
  ListChecks,
  PlayCircle,
  RotateCcw,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const progress = useQuery(api.progress.getProgress);

  const completedSlugs = progress?.lessonSlugs ?? [];
  const extraSlugs = progress?.extraSlugs ?? [];

  // Опрос перед первым уроком: показываем, если ответа ещё нет.
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [onboarding, setOnboarding] = useState(() => loadOnboarding());

  useEffect(() => {
    if (!onboarding) setSurveyOpen(true);
  }, [onboarding]);

  const handleSurveyDone = () => {
    setOnboarding(loadOnboarding());
    const saved = loadOnboarding();
    const target = courses.find((c) => c.slug === saved?.lang) ?? courses[0];
    const first = nextUnfinishedLesson(target, completedSlugs);
    toast.success(`Программа подобрана: начинаем с курса «${target.title}»`);
    navigate(`/lesson/${first?.slug ?? ""}`);
  };

  const handleRetake = () => {
    setSurveyOpen(true);
  };

  const handleSurveySave = (value: Parameters<typeof saveOnboarding>[0]) => {
    saveOnboarding(value);
    setOnboarding(value);
  };

  const displayName = user?.isAnonymous
    ? "Гость"
    : user?.name ?? user?.email ?? "Ученик";

  // Каталог курсов: прогресс по слагам каждого курса.
  const courseStats = useMemo(
    () =>
      courses.map((c) => {
        const lessons = allLessons(c);
        const done = lessons.filter((l) => completedSlugs.includes(l.slug)).length;
        return {
          course: c,
          done,
          total: lessons.length,
          pct:
            lessons.length === 0
              ? 0
              : Math.round((done / lessons.length) * 100),
        };
      }),
    [completedSlugs],
  );

  // Выбранный курс (из опроса) — открываем по умолчанию.
  const activeCourse =
    courses.find((c) => c.slug === onboarding?.lang) ?? courses[0];
  const activeStats =
    courseStats.find((s) => s.course.slug === activeCourse.slug) ?? courseStats[0];

  // Первый незавершённый урок активного курса.
  const nextLesson = useMemo(
    () => nextUnfinishedLesson(activeCourse, completedSlugs),
    [activeCourse, completedSlugs],
  );

  const totalCompleted = completedSlugs.length;
  const totalLessons = courseStats.reduce((acc, s) => acc + s.total, 0);
  const totalPct =
    totalLessons === 0 ? 0 : Math.round((totalCompleted / totalLessons) * 100);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-editor text-xs text-primary">
              ~/dashboard $
              <span className="ml-2 animate-blink">▍</span>
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Привет, {displayName}!
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {courses.length} курсов · всё бесплатно, всё в вашем темпе
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 font-editor text-xs"
            onClick={handleRetake}
          >
            <Sparkles className="size-3.5" />
            {onboarding ? "Сменить трек" : "Пройти опрос"}
          </Button>
        </div>

        {/* Общий прогресс + следующий урок */}
        <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/60 bg-card p-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">Общий прогресс</h2>
              <span className="font-editor text-sm text-primary">
                {totalCompleted}/{totalLessons} уроков
              </span>
            </div>
            <Progress value={totalPct} className="h-2.5" />
            <p className="mt-2 text-xs text-muted-foreground">
              {totalPct}% всех курсов пройдено
              {totalCompleted > 0 && totalCompleted === totalLessons && (
                <span className="ml-2 inline-flex items-center gap-1 font-editor text-primary">
                  <Award className="size-3.5" /> всё завершено — поздравляем!
                </span>
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {courseStats.map((s) => (
                <span
                  key={s.course.slug}
                  className="flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-1 font-editor text-[11px] text-muted-foreground"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: s.course.accent }}
                  />
                  {s.course.langName} {s.done}/{s.total}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex flex-col justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-5"
          >
            <div>
              <p className="font-editor text-xs text-primary">
                // следующий урок · {activeCourse.langName}
              </p>
              <h3 className="mt-1.5 font-semibold leading-snug">
                {nextLesson?.title ?? "Курс завершён"}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                {nextLesson?.minutes ?? 0} мин
              </p>
            </div>
            <Button
              className="w-full gap-2 font-editor"
              onClick={() => navigate(`/lesson/${nextLesson?.slug ?? ""}`)}
              disabled={!nextLesson}
            >
              <PlayCircle className="size-4" />
              {activeStats.done > 0 ? "Продолжить" : "Начать курс"}
            </Button>
          </motion.div>
        </div>

        {/* Каталог курсов */}
        <h2 className="mb-4 font-editor text-sm text-muted-foreground">
          // каталог курсов
        </h2>
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          {courseStats.map((s, i) => {
            const isActive = s.course.slug === activeCourse.slug;
            const first = nextUnfinishedLesson(s.course, completedSlugs);
            return (
              <motion.div
                key={s.course.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className={
                  "flex flex-col overflow-hidden rounded-xl border bg-card transition-colors " +
                  (isActive
                    ? "border-primary/50"
                    : "border-border/60 hover:border-primary/40")
                }
              >
                <div className="flex items-center gap-3 border-b border-border/60 bg-editor-gutter/40 px-4 py-3">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-md font-editor text-xs font-bold"
                    style={{
                      backgroundColor: `${s.course.accent}22`,
                      color: s.course.accent,
                    }}
                  >
                    {s.course.langName.slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{s.course.title}</h3>
                    {isActive && (
                      <span className="font-editor text-[10px] text-primary">
                        ваш трек
                      </span>
                    )}
                  </div>
                  <span className="ml-auto font-editor text-xs text-muted-foreground">
                    {s.done}/{s.total}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <p className="text-sm leading-6 text-muted-foreground">
                    {s.course.tagline}
                  </p>
                  <Progress value={s.pct} className="h-1.5" />
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="font-editor text-[11px] text-muted-foreground">
                      {s.pct}% пройдено
                    </span>
                    <Button
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                      className="gap-1.5 font-editor text-xs"
                      onClick={() => {
                        // Выбор курса из каталога обновляет трек, не меняя ответ на вопрос.
                        handleSurveySave({
                          knows: onboarding?.knows ?? true,
                          lang: s.course.slug,
                        });
                        navigate(`/lesson/${first?.slug ?? ""}`);
                      }}
                    >
                      {s.done === 0 ? "Начать" : s.pct === 100 ? "Повторить" : "Продолжить"}
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Напоминание об уроке */}
        <div className="mb-10">
          <DailyReminder lessonSlugs={completedSlugs} />
        </div>

        {/* Программа и доп. задания */}
        <Tabs defaultValue="program" className="gap-6">
          <TabsList className="w-fit">
            <TabsTrigger value="program" className="gap-1.5 font-editor text-xs">
              <ListChecks className="size-3.5" />
              Программа
            </TabsTrigger>
            <TabsTrigger value="extras" className="gap-1.5 font-editor text-xs">
              <Sparkles className="size-3.5" />
              Доп. задания
            </TabsTrigger>
          </TabsList>

          <TabsContent value="program">
            <ProgramSection
              activeCourse={activeCourse}
              completedSlugs={completedSlugs}
            />
          </TabsContent>

          <TabsContent value="extras">
            <ExtrasPanel extraSlugs={extraSlugs} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 text-xs text-muted-foreground">
          <span className="font-editor">
            soo<span className="text-primary">gy</span>
          </span>{" "}
          · письменные курсы с автопроверкой домашек
        </div>
      </footer>

      <OnboardingDialog
        open={surveyOpen}
        onOpenChange={setSurveyOpen}
        onDone={handleSurveyDone}
      />
    </div>
  );
}

function ProgramSection({
  activeCourse,
  completedSlugs,
}: {
  activeCourse: (typeof courses)[number];
  completedSlugs: string[];
}) {
  const navigate = useNavigate();
  const resetLesson = useMutation(api.progress.resetLesson);
  const [confirmResetSlug, setConfirmResetSlug] = useState<string | null>(null);

  const handleReset = (slug: string) => {
    resetLesson({ lessonSlug: slug });
    setConfirmResetSlug(null);
    toast.success("Прогресс урока сброшен — можно пройти заново");
  };

  return (
    <div className="flex flex-col gap-6">
          <h2 className="mb-2 font-editor text-sm text-muted-foreground">
            // программа курса {activeCourse.langName.toLowerCase()}
          </h2>
          {activeCourse.modules.map((m, mi) => {
            const modDone = m.lessons.every((l) => completedSlugs.includes(l.slug));
            return (
              <section key={m.id}>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 font-editor text-xs text-primary">
                    module-{mi + 1}
                  </span>
                  <h3 className="font-semibold">{m.title}</h3>
                  {modDone && (
                    <span className="font-editor text-xs text-primary">
                      ✓ модуль пройден
                    </span>
                  )}
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{m.goal}</p>
                <div className="flex flex-col gap-2">
                  {m.lessons.map((l) => {
                    const done = completedSlugs.includes(l.slug);
                    const isConfirming = confirmResetSlug === l.slug;
                    return (
                      <motion.div
                        key={l.slug}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.25 }}
                        className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3.5 transition-colors hover:border-primary/40"
                      >
                        <button
                          type="button"
                          onClick={() => navigate(`/lesson/${l.slug}`)}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          {done ? (
                            <CheckCircle2 className="size-5 shrink-0 text-primary" />
                          ) : (
                            <Circle className="size-5 shrink-0 text-muted-foreground/50 group-hover:text-primary/70" />
                          )}
                          <span className="min-w-0">
                            <span className="block truncate font-medium">
                              {l.title}
                            </span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" /> {l.minutes} мин
                              </span>
                              {l.quiz && (
                                <span className="flex items-center gap-1">
                                  <ListChecks className="size-3" /> квиз
                                </span>
                              )}
                              {l.task && (
                                <span className="flex items-center gap-1">
                                  <TerminalSquare className="size-3" /> практика
                                </span>
                              )}
                            </span>
                          </span>
                        </button>
                        {done ? (
                          isConfirming ? (
                            <span className="flex shrink-0 items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 gap-1 px-2 font-editor text-xs text-destructive hover:text-destructive"
                                onClick={() => handleReset(l.slug)}
                              >
                                сбросить
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 font-editor text-xs"
                                onClick={() => setConfirmResetSlug(null)}
                              >
                                отмена
                              </Button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              title="Пройти заново"
                              className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                              onClick={() => setConfirmResetSlug(l.slug)}
                            >
                              <RotateCcw className="size-3.5" />
                            </button>
                          )
                        ) : (
                          <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 group-hover:text-primary" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })}
    </div>
  );
}
