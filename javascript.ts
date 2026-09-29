import type { Course, Lesson } from "../course-content";
import { jsDictModule } from "../dict/dict-web";

/* Модуль 1. Основы JS */
const m1: Lesson[] = [
  {
    slug: "js-syntax",
    title: "Синтаксис и переменные",
    minutes: 15,
    summary: "let, const, типы данных и вывод в консоль.",
    theory: [
      {
        filename: "script.js",
        lang: "js" as const,
        intro:
          "JavaScript оживляет веб-страницы: кнопки, анимации, данные. Переменные: let (меняется) и const (константа).",
        code: `let score = 0;
const maxScore = 10;
console.log("Привет, JS!");`,
      },
      {
        filename: "типы.js",
        lang: "js" as const,
        intro:
          "Шаблонные строки в бэктиках подставляют значения: `Привет, ${name}!`. Это как f-строки в Python.",
        code: `const name = "Аня";
const age = 20;
console.log(\`\${name}: \${age}\`);`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Чем const отличается от let?",
          options: [
            { id: "a", text: "const нельзя переприсвоить" },
            { id: "b", text: "const быстрее" },
            { id: "c", text: "Ничем" },
          ],
          correctId: "a",
          explanation: "const — константа: повторное присваивание вызовет ошибку.",
        },
        {
          id: "q2",
          prompt: "Что выведет console.log(`2+2=${2+2}`)?",
          options: [
            { id: "a", text: "2+2=4" },
            { id: "b", text: "2+2=${2+2}" },
            { id: "c", text: "Ошибку" },
          ],
          correctId: "a",
          explanation: "${...} внутри бэктиков вычисляется.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Создайте const-строку и let-число, выведите шаблонной строкой через console.log.",
      files: [
        {
          id: "script.js",
          label: "script.js",
          starter: `// const, let и шаблонная строка\n`,
        },
      ],
      textChecks: [
        {
          checkId: "const",
          title: "Есть const со строкой",
          test: (h) => /const\s+\w+\s*=\s*["'][^"']+["']/.test(h.file("script.js")),
          hintOk: "const найдена.",
          hintFail: 'const name = "Аня";',
        },
        {
          checkId: "let",
          title: "Есть let с числом",
          test: (h) => /\blet\s+\w+\s*=\s*\d+/.test(h.file("script.js")),
          hintOk: "let найдена.",
          hintFail: "let score = 0;",
        },
        {
          checkId: "template",
          title: "Шаблонная строка с ${...}",
          test: (h) => /`[^`]*\$\{[^}]+\}[^`]*`/.test(h.file("script.js")),
          hintOk: "Бэктики с ${} найдены.",
          hintFail: "console.log(`Имя: ${name}`)",
        },
        {
          checkId: "log",
          title: "Есть console.log",
          test: (h) => /console\.log\s*\(/.test(h.file("script.js")),
          hintOk: "Вывод найден.",
          hintFail: "console.log(...)",
        },
      ],
    },
  },
];

/* Модуль 2. Логика и данные */
const m2: Lesson[] = [
  {
    slug: "js-logic",
    title: "Условия и функции",
    minutes: 20,
    summary: "if/else, стрелочные функции, return.",
    theory: [
      {
        filename: "логика.js",
        lang: "js" as const,
        intro:
          "Условия как в C++: if (...) { ... } else { ... }. Стрелочные функции — короткая запись function.",
        code: `const canVote = (age) => {
  if (age >= 18) {
    return true;
  }
  return false;
};`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Что эквивалентно function f(x) { return x; }?",
          options: [
            { id: "a", text: "const f = (x) => x;" },
            { id: "b", text: "let f = x =>: x" },
            { id: "c", text: "def f(x): return x" },
          ],
          correctId: "a",
          explanation: "Стрелка с выражением сразу возвращает его.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Напишите стрелочную функцию add(a, b) с return суммы и вызовите её в console.log.",
      files: [
        {
          id: "script.js",
          label: "script.js",
          starter: `// const add = (a, b) => { ... };\n`,
        },
      ],
      textChecks: [
        {
          checkId: "arrow",
          title: "Стрелочная функция add объявлена",
          test: (h) => /(const|let)\s+add\s*=\s*\(\s*a\s*,\s*b\s*\)\s*=>/.test(h.file("script.js")),
          hintOk: "Сигнатура верная.",
          hintFail: "const add = (a, b) => { return a + b; };",
        },
        {
          checkId: "ret",
          title: "Внутри return a + b",
          test: (h) => /return\s+a\s*\+\s*b/.test(h.file("script.js")),
          hintOk: "Возврат найден.",
          hintFail: "return a + b;",
        },
        {
          checkId: "call",
          title: "Вызов в console.log",
          test: (h) => /console\.log\s*\(\s*add\s*\(/.test(h.file("script.js")),
          hintOk: "Вызов найден.",
          hintFail: "console.log(add(2, 3));",
        },
      ],
    },
  },
  {
    slug: "js-arrays",
    title: "Массивы и методы",
    minutes: 20,
    summary: "push, length, перебор через for..of и map.",
    theory: [
      {
        filename: "массивы.js",
        lang: "js" as const,
        intro:
          "Массив — упорядоченный список значений. push добавляет в конец, length — длина.",
        code: `const fruits = ["яблоко", "банан"];
fruits.push("киви");
console.log(fruits.length); // 3`,
      },
      {
        filename: "перебор.js",
        lang: "js" as const,
        intro:
          "map превращает каждый элемент: из массива чисел — массив строк.",
        code: `const nums = [1, 2, 3];
const labels = nums.map((n) => \`#\${n}\`);
// ["#1", "#2", "#3"]`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Что делает map?",
          options: [
            { id: "a", text: "Создаёт новый массив из преобразованных элементов" },
            { id: "b", text: "Сортирует массив" },
            { id: "c", text: "Удаляет элементы" },
          ],
          correctId: "a",
          explanation: "map не меняет исходный массив, а возвращает новый.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Создайте массив из трёх элементов, добавьте четвёртый через push и выведите length; затем примените map.",
      files: [
        {
          id: "script.js",
          label: "script.js",
          starter: `// массив, push, length, map\n`,
        },
      ],
      textChecks: [
        {
          checkId: "arr",
          title: "Массив из 3+ элементов",
          test: (h) => /\[[^\\\]]+,[^\]]+,[^\]]+\]/.test(h.file("script.js")),
          hintOk: "Массив найден.",
          hintFail: 'const items = ["a", "b", "c"];',
        },
        {
          checkId: "push",
          title: "Использован .push(",
          test: (h) => /\.push\s*\(/.test(h.file("script.js")),
          hintOk: "push найден.",
          hintFail: 'items.push("d");',
        },
        {
          checkId: "length",
          title: "Использован .length",
          test: (h) => /\.length\b/.test(h.file("script.js")),
          hintOk: "length найден.",
          hintFail: "console.log(items.length);",
        },
        {
          checkId: "map",
          title: "Использован .map(",
          test: (h) => /\.map\s*\(/.test(h.file("script.js")),
          hintOk: "map найден.",
          hintFail: "const labels = items.map((x) => ...);",
        },
      ],
    },
  },
];

export const jsCourse: Course = {
  slug: "javascript",
  title: "JavaScript с нуля",
  tagline:
    "Язык веба: интерфейсы, серверы и даже мобильные приложения. Идёт после HTML-курса.",
  langId: "js",
  langName: "JavaScript",
  accent: "#f1e05a",
  modules: [
    { id: "jm1", title: "Основы JS", goal: "Переменные, типы, вывод, шаблонные строки.", lessons: m1 },
    { id: "jm2", title: "Логика и данные", goal: "Функции, условия, массивы и методы.", lessons: m2 },
    jsDictModule,
  ],
};
