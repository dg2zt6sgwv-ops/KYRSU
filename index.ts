import { course as htmlCourse } from "../course-data";
import { pythonCourse } from "./python";
import { cppCourse } from "./cpp";
import { luaCourse } from "./lua";
import { jsCourse } from "./javascript";
import type { Course, LessonLocation } from "../course-content";

/** Все курсы платформы. Порядок — «от простого к сложному», он же трек для новичков. */
export const courses: Course[] = [
  htmlCourse,
  pythonCourse,
  jsCourse,
  cppCourse,
  luaCourse,
];

/** Курс по умолчанию (трек «с нуля»): HTML-курс первым. */
export const defaultCourse: Course = htmlCourse;

export function findCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

/** Найти урок по слагу во всех курсах сразу. */
export function findLessonGlobal(slug: string): LessonLocation | undefined {
  for (const course of courses) {
    for (const module of course.modules) {
      const lesson = module.lessons.find((l) => l.slug === slug);
      if (lesson) return { lesson, course, module };
    }
  }
  return undefined;
}

/** Первый незавершённый урок курса (или первый урок, если всё пройдено). */
export function nextUnfinishedLesson(course: Course, doneSlugs: string[]) {
  const all = course.modules.flatMap((m) => m.lessons);
  return all.find((l) => !doneSlugs.includes(l.slug)) ?? all[0];
}
