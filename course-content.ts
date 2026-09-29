/* ---------- Квизы ---------- */

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

/* ---------- Код-задания ---------- */

/** Mode of verification: rendered page (web) or source text (console languages). */
export type VerifyMode = "dom" | "text";

/** Minimal DOM helpers passed to each DOM check. */
export interface CheckHelpers {
  element: HTMLElement;
  q: (sel: string) => Element | null;
  qa: (sel: string) => Element[];
  text: (sel: string) => string;
  normText: (s: string) => string;
  /** Computed style property of the first matched element. */
  style: (sel: string, prop: string) => string;
  /** Attribute of the first matched element. */
  attr: (sel: string, name: string) => string | null;
  /** A global function defined by the learner's JS, if it exists. */
  fn: (name: string) => ((...a: unknown[]) => unknown) | null;
  /** Dispatch a click on the first matched element. */
  click: (sel: string) => void;
}

/** Helpers for text-based (source code) checks. */
export interface TextHelpers {
  /** Full concatenated source of all files. */
  all: string;
  /** Source of a single file by tab id. */
  file: (id: string) => string;
}

/** A single verifiable condition. */
export interface CheckDefinition {
  checkId: string;
  title: string;
  /** Returns true if the check passes. */
  test: (h: CheckHelpers) => boolean;
  hintOk: string;
  hintFail?: string;
}

export interface TextCheckDefinition {
  checkId: string;
  title: string;
  test: (h: TextHelpers) => boolean;
  hintOk: string;
  hintFail?: string;
}

export interface CodeFile {
  id: string;
  label: string;
  starter: string;
}

export interface CodeTask {
  /** "dom" — живая страница (HTML/CSS/JS), "text" — исходники файлов (Python и т.п.). По умолчанию "dom". */
  mode?: VerifyMode;
  instruction: string;
  /** DOM mode: fixed html/css/js panes. */
  starterHtml?: string;
  starterCss?: string;
  starterJs?: string;
  /** Text mode: arbitrary files (e.g. main.py). */
  files?: CodeFile[];
  /** DOM mode checks. */
  checks?: CheckDefinition[];
  /** Text mode checks. */
  textChecks?: TextCheckDefinition[];
}

/* ---------- Уроки и модули ---------- */

/** One theory "card": editor-style file card with short text. */
export interface TheoryCard {
  filename: string;
  lang: "html" | "css" | "js" | "python" | "cpp" | "lua";
  intro: string;
  code: string;
  note?: string;
}

export interface Lesson {
  slug: string;
  title: string;
  minutes: number;
  /** Short summary shown in module lists. */
  summary: string;
  theory: TheoryCard[];
  quiz?: Quiz;
  task?: CodeTask;
}

export interface Module {
  id: string;
  title: string;
  goal: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  title: string;
  tagline: string;
  /** Short lowercase id for editor chrome, e.g. "py", "cpp". */
  langId: string;
  /** Human language name for UI. */
  langName: string;
  accent: string;
  modules: Module[];
}

/* ---------- Компактные хелперы для контента ---------- */

/** Теория-карточка: одна «словарная статья» с кодом. */
export function card(
  filename: string,
  lang: TheoryCard["lang"],
  intro: string,
  code: string,
  note?: string,
): TheoryCard {
  return note === undefined ? { filename, lang, intro, code } : { filename, lang, intro, code, note };
}

/**
 * Вопрос квиза из 2–3 вариантов. Верный ответ автоматически занимает разные
 * позиции (по хэшу id), чтобы «правильный всегда первый» не было.
 */
export function mkQ(
  id: string,
  prompt: string,
  correct: string,
  wrong: string[],
  explanation: string,
): QuizQuestion {
  const wrongIds = ["b", "c", "d"];
  const options: QuizOption[] = [
    { id: "a", text: correct },
    ...wrong.slice(0, 3).map((text, i) => ({ id: wrongIds[i], text })),
  ];
  const hash = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const shift = hash % options.length;
  const rotated = options.slice(shift).concat(options.slice(0, shift));
  const correctId = rotated.find((o) => o.text === correct)!.id;
  return { id, prompt, options: rotated, correctId, explanation };
}

/** Текстовое код-задание (main.py / main.cpp / main.lua / script.js). */
export function taskText(
  instruction: string,
  fileId: string,
  starter: string,
  checks: {
    checkId: string;
    title: string;
    test: (h: TextHelpers) => boolean;
    hintOk: string;
    hintFail?: string;
  }[],
): CodeTask {
  return {
    mode: "text",
    instruction,
    files: [{ id: fileId, label: fileId, starter }],
    textChecks: checks,
  };
}

/** DOM-задание с живой страницей (HTML/CSS/JS). */
export function taskDom(
  instruction: string,
  starter: { html?: string; css?: string; js?: string },
  checks: {
    checkId: string;
    title: string;
    test: (h: CheckHelpers) => boolean;
    hintOk: string;
    hintFail?: string;
  }[],
): CodeTask {
  return {
    instruction,
    starterHtml: starter.html ?? "",
    starterCss: starter.css ?? "",
    starterJs: starter.js ?? "",
    checks,
  };
}

/* ---------- Дополнительные задания ---------- */

/** Лёгкое дополнительное задание — можно решать в любой момент, без дедлайна. */
export interface ExtraTask {
  id: string;
  /** Слаг курса, к которому относится задание. */
  langSlug: string;
  /** Название языка/темы для бейджа. */
  langName: string;
  accent: string;
  title: string;
  /** Примерное время, минуты. */
  minutes: number;
  task: CodeTask;
}

/** Награда XP за прогресс. */
export const XP = {
  lesson: 25,
  extra: 10,
} as const;

/* ---------- Типы прогресса ---------- */

/** All lesson slugs in order, across modules. */
export function allLessons(course: Course): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export function findLesson(course: Course, slug: string): Lesson | undefined {
  return allLessons(course).find((l) => l.slug === slug);
}

export function moduleOfLesson(course: Course, slug: string): Module | undefined {
  return course.modules.find((m) => m.lessons.some((l) => l.slug === slug));
}

/** Result of searching all courses at once. */
export interface LessonLocation {
  lesson: Lesson;
  course: Course;
  module: Module;
}

/** Lesson neighbours for prev/next navigation. */
export function lessonNeighbours(
  course: Course,
  slug: string,
): { prev: Lesson | null; next: Lesson | null } {
  const list = allLessons(course);
  const idx = list.findIndex((l) => l.slug === slug);
  return {
    prev: idx > 0 ? list[idx - 1] : null,
    next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
  };
}

/** Result of running all checks against the learner's code. */
export interface VerificationCheck {
  id: string;
  title: string;
  pass: boolean;
  message: string;
}

export interface VerificationResult {
  passed: boolean;
  checks: VerificationCheck[];
  message: string;
}
