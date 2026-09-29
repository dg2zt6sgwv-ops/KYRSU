/**
 * Базовый префикс приложения.
 *
 * На GitHub Pages сайт живёт в /имя-репозитория/, поэтому все абсолютные
 * ссылки (ассеты, скачивание zip, BrowserRouter) должны учитывать этот путь.
 * Vite сам подставляет BASE_URL из поля base в vite.config.ts.
 */
export const BASE_NAME: string = import.meta.env.BASE_URL || "/";

/** Путь к статическому файлу из папки public (учитывает base). */
export function assetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = BASE_NAME.endsWith("/") ? BASE_NAME : `${BASE_NAME}/`;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return base + clean;
}

/** basename для BrowserRouter: без завершающего слэша («/» остаётся «/»). */
export const routerBasename: string =
  BASE_NAME === "/" ? "/" : BASE_NAME.replace(/\/$/, "");
