import { taskDom, taskText } from "./course-content";
import type { CodeTask, ExtraTask } from "./course-content";

export interface ExtraTaskDef extends Omit<ExtraTask, "task"> {
  task: CodeTask;
}

/** Лёгкие разминки-дополнительки: можно решать в любой момент, без дедлайнов. */
export const extraTasks: ExtraTaskDef[] = [
  /* ---------------- HTML ---------------- */
  {
    id: "x-html-1",
    langSlug: "html",
    langName: "HTML",
    accent: "#e34c26",
    title: "Разминка: якорная ссылка",
    minutes: 4,
    task: taskDom(
      "Сделайте ссылку <a> с атрибутом href, ведущим на любой сайт, и текстом внутри. Всё просто — это разминка.",
      { html: `<!-- одна ссылка здесь -->\n` },
      [
        {
          checkId: "link",
          title: "Есть ссылка a с href",
          test: (h) => h.attr("a", "href") !== null,
          hintOk: "Ссылка найдена.",
          hintFail: '<a href="https://example.com">текст</a>',
        },
        {
          checkId: "text",
          title: "У ссылки есть текст",
          test: (h) => h.text("a").length > 0,
          hintOk: "Текст ссылки на месте.",
          hintFail: "Между <a> и </a> напишите любой текст.",
        },
      ],
    ),
  },
  {
    id: "x-html-2",
    langSlug: "html",
    langName: "HTML",
    accent: "#e34c26",
    title: "Мини: список покупок",
    minutes: 5,
    task: taskDom(
      "Соберите маркированный список ul из трёх пунктов li — например, список покупок.",
      { html: `<!-- ul с тремя li -->\n` },
      [
        {
          checkId: "ul",
          title: "Есть список ul",
          test: (h) => h.q("ul") !== null,
          hintOk: "Список найден.",
          hintFail: "Добавьте <ul> ... </ul>.",
        },
        {
          checkId: "li3",
          title: "Внутри минимум 3 пункта li",
          test: (h) => h.qa("li").length >= 3,
          hintOk: "Пункты на месте.",
          hintFail: "Три раза: <li>продукт</li>.",
        },
      ],
    ),
  },

  /* ---------------- CSS (HTML-курс) ---------------- */
  {
    id: "x-css-1",
    langSlug: "html",
    langName: "CSS",
    accent: "#2965f1",
    title: "Мини: покрасить кнопку",
    minutes: 5,
    task: taskDom(
      "Дайте кнопке .btn зелёный текст и фон по вкусу. Достаточно двух свойств: color и background.",
      {
        html: `<button class="btn">Нажми</button>\n`,
        css: `.btn {\n  /* color и background */\n}\n`,
      },
      [
        {
          checkId: "color",
          title: "У кнопки задан цвет текста",
          test: (h) => {
            const c = h.style(".btn", "color");
            return c !== "" && !c.startsWith("rgb(0, 0, 0)");
          },
          hintOk: "Цвет текста задан.",
          hintFail: "Добавьте color: green; (или другой цвет).",
        },
        {
          checkId: "bg",
          title: "У кнопки есть фон",
          test: (h) => {
            const bg = h.style(".btn", "background-color");
            return bg !== "" && bg !== "transparent" && !bg.startsWith("rgba(0, 0, 0, 0)");
          },
          hintOk: "Фон найден.",
          hintFail: "Добавьте background: <цвет>;",
        },
      ],
    ),
  },

  /* ---------------- Python ---------------- */
  {
    id: "x-py-1",
    langSlug: "python",
    langName: "Python",
    accent: "#3572A5",
    title: "Разминка: три приветствия",
    minutes: 4,
    task: taskText(
      "Выведите циклом for слово «привет» три раза. range(3) в помощь!",
      "main.py",
      `# цикл for + print\n`,
      [
        {
          checkId: "for",
          title: "Есть цикл for",
          test: (h) => /\bfor\s+\w+\s+in\s+/.test(h.file("main.py")),
          hintOk: "Цикл найден.",
          hintFail: "for i in range(3):",
        },
        {
          checkId: "range3",
          title: "Использован range(3)",
          test: (h) => /range\s*\(\s*3\s*\)/.test(h.file("main.py")),
          hintOk: "range(3) на месте.",
          hintFail: "range(3) даёт ровно три повторения.",
        },
        {
          checkId: "print",
          title: "Внутри цикла есть print",
          test: (h) => /print\s*\(/.test(h.file("main.py")),
          hintOk: "Печать найдена.",
          hintFail: "С отступом внутри цикла: print(\"привет\")",
        },
      ],
    ),
  },
  {
    id: "x-py-2",
    langSlug: "python",
    langName: "Python",
    accent: "#3572A5",
    title: "Мини: длина строки",
    minutes: 5,
    task: taskText(
      "Создайте переменную word со строкой и выведите её длину через len().",
      "main.py",
      `word = "..."\n\n# выведите len(word)\n`,
      [
        {
          checkId: "word",
          title: "Есть переменная word со строкой",
          test: (h) => /\bword\s*=\s*["'][^"']+["']/.test(h.file("main.py")),
          hintOk: "Переменная найдена.",
          hintFail: 'word = "питон"',
        },
        {
          checkId: "len",
          title: "Использован len(...)",
          test: (h) => /\blen\s*\(\s*word\s*\)/.test(h.file("main.py")),
          hintOk: "len(word) найден.",
          hintFail: "print(len(word))",
        },
      ],
    ),
  },

  /* ---------------- JavaScript ---------------- */
  {
    id: "x-js-1",
    langSlug: "javascript",
    langName: "JavaScript",
    accent: "#f1e05a",
    title: "Разминка: сумма двух чисел",
    minutes: 4,
    task: taskText(
      "Создайте две числовые переменные и выведите их сумму в console.log.",
      "script.js",
      `const a = 2;\nconst b = 3;\n\n// выведите сумму\n`,
      [
        {
          checkId: "vars",
          title: "Есть две числовые переменные",
          test: (h) =>
            /(const|let)\s+\w+\s*=\s*\d+/.test(h.file("script.js")) &&
            ((h.file("script.js").match(/(const|let)\s+\w+\s*=\s*\d+/g) ?? []).length >= 2),
          hintOk: "Переменные найдены.",
          hintFail: "const a = 2; const b = 3;",
        },
        {
          checkId: "log-sum",
          title: "Сумма выводится в console.log",
          test: (h) => /console\.log\s*\(\s*\w+\s*\+\s*\w+\s*\)/.test(h.file("script.js")),
          hintOk: "Сумма выводится.",
          hintFail: "console.log(a + b);",
        },
      ],
    ),
  },
  {
    id: "x-js-2",
    langSlug: "javascript",
    langName: "JavaScript",
    accent: "#f1e05a",
    title: "Мини: стрелочная функция",
    minutes: 5,
    task: taskText(
      "Создайте стрелочную функцию double, которая удваивает число, и вызовите её.",
      "script.js",
      `// const double = (n) => ...\n`,
      [
        {
          checkId: "arrow",
          title: "Функция double объявлена стрелкой",
          test: (h) => /\bconst\s+double\s*=\s*\(?[^)=]*\)?\s*=>/.test(h.file("script.js")),
          hintOk: "Стрелочная функция найдена.",
          hintFail: "const double = (n) => n * 2;",
        },
        {
          checkId: "call",
          title: "Функция вызывается",
          test: (h) => /\bdouble\s*\(\s*\d+\s*\)/.test(h.file("script.js")),
          hintOk: "Вызов найден.",
          hintFail: "console.log(double(4));",
        },
      ],
    ),
  },

  /* ---------------- C++ ---------------- */
  {
    id: "x-cpp-1",
    langSlug: "cpp",
    langName: "C++",
    accent: "#f34b7d",
    title: "Разминка: return в функции",
    minutes: 5,
    task: taskText(
      "Напишите функцию square(int x), возвращающую x * x, и вызовите её в main.",
      "main.cpp",
      `#include <iostream>\n\n// функция square здесь\n\nint main() {\n    // вызов square\n    return 0;\n}\n`,
      [
        {
          checkId: "def",
          title: "Функция square объявлена",
          test: (h) => /\bint\s+square\s*\(\s*int\s+\w+\s*\)/.test(h.file("main.cpp")),
          hintOk: "Функция найдена.",
          hintFail: "int square(int x) { return x * x; }",
        },
        {
          checkId: "ret",
          title: "Есть return с умножением",
          test: (h) => /\breturn\s+\w+\s*\*\s*\w+\s*;/.test(h.file("main.cpp")),
          hintOk: "return найден.",
          hintFail: "return x * x;",
        },
        {
          checkId: "call",
          title: "square вызывается",
          test: (h) => /\bsquare\s*\(\s*\d+\s*\)/.test(h.file("main.cpp")),
          hintOk: "Вызов найден.",
          hintFail: "std::cout << square(5);",
        },
      ],
    ),
  },

  /* ---------------- Lua ---------------- */
  {
    id: "x-lua-1",
    langSlug: "lua",
    langName: "Lua",
    accent: "#000080",
    title: "Разминка: цикл по таблице",
    minutes: 5,
    task: taskText(
      "Создайте таблицу fruits из трёх строк и переберите её циклом for с ipairs, печатая каждый элемент.",
      "main.lua",
      `-- таблица и цикл for\n`,
      [
        {
          checkId: "table",
          title: "Есть таблица из 3+ элементов",
          test: (h) => /\{[^}]+,[^}]+,[^}]+\}/.test(h.file("main.lua")),
          hintOk: "Таблица найдена.",
          hintFail: 'local fruits = {"яблоко", "банан", "киви"}',
        },
        {
          checkId: "ipairs",
          title: "Использован for с ipairs",
          test: (h) => /\bfor\s+\w+\s*,?\s*\w*\s+in\s+ipairs\s*\(/.test(h.file("main.lua")),
          hintOk: "Цикл с ipairs найден.",
          hintFail: "for i, v in ipairs(fruits) do ... end",
        },
        {
          checkId: "print",
          title: "Элемент печатается",
          test: (h) => /print\s*\(/.test(h.file("main.lua")),
          hintOk: "Печать найдена.",
          hintFail: "print(v)",
        },
      ],
    ),
  },
];

export function findExtra(id: string): ExtraTaskDef | undefined {
  return extraTasks.find((t) => t.id === id);
}

/** XP-награда за дополнительное задание. */
export const EXTRA_XP = 10;
