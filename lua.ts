import type { Course, Lesson } from "../course-content";
import { luaDictModule } from "../dict/dict-cpp-lua";

/* Модуль 1. Основы Lua */
const m1: Lesson[] = [
  {
    slug: "lua-hello",
    title: "Первая программа",
    minutes: 10,
    summary: "print, комментарии, минимальный синтаксис.",
    theory: [
      {
        filename: "main.lua",
        lang: "lua" as const,
        intro:
          "Lua — лёгкий скриптовый язык: его используют в играх (Roblox) и встраиваемых системах. Программа — просто строки кода.",
        code: `print("Привет, мир!")`,
      },
      {
        filename: "комментарии.lua",
        lang: "lua" as const,
        intro:
          "Однострочный комментарий начинается с двух дефисов. Это главное отличие от большинства языков.",
        code: `-- это комментарий
print("А это код")`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Как начинается комментарий в Lua?",
          options: [
            { id: "a", text: "--" },
            { id: "b", text: "#" },
            { id: "c", text: "//" },
          ],
          correctId: "a",
          explanation: "Два дефиса -- — однострочный комментарий Lua.",
        },
        {
          id: "q2",
          prompt: "Где используют Lua?",
          options: [
            { id: "a", text: "В играх, например Roblox" },
            { id: "b", text: "Только на серверах" },
            { id: "c", text: "Нигде, это учебный язык" },
          ],
          correctId: "a",
          explanation:
            "Lua встраивают в игры и приложения — скрипты пишут на нём.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Напишите два вызова print() и добавьте комментарий с двумя дефисами.",
      files: [
        {
          id: "main.lua",
          label: "main.lua",
          starter: `-- два print и комментарий\n`,
        },
      ],
      textChecks: [
        {
          checkId: "prints",
          title: "Есть два вызова print()",
          test: (h) => (h.file("main.lua").match(/print\s*\(/g) ?? []).length >= 2,
          hintOk: "Два print найдены.",
          hintFail: 'print("строка") — дважды.',
        },
        {
          checkId: "strings",
          title: "Строки в кавычках",
          test: (h) => /print\s*\(\s*["'][^"']+["']\s*\)/.test(h.file("main.lua")),
          hintOk: "Кавычки на месте.",
          hintFail: 'print("текст")',
        },
        {
          checkId: "comment",
          title: "Есть комментарий --",
          test: (h) => h.file("main.lua").includes("--"),
          hintOk: "Комментарий найден.",
          hintFail: "Добавьте строку, начинающуюся с --",
        },
      ],
    },
  },
  {
    slug: "lua-vars",
    title: "Переменные и типы",
    minutes: 15,
    summary: "local, числа, строки, конкатенация через ..",
    theory: [
      {
        filename: "переменные.lua",
        lang: "lua" as const,
        intro:
          "local создаёт локальную переменную. Тип определяется значением, как в Python.",
        code: `local name = "Аня"
local age = 20
local pi = 3.14`,
      },
      {
        filename: "склейка.lua",
        lang: "lua" as const,
        intro:
          "Строки склеиваются оператором .. (две точки). Числа автоматически превращаются в текст.",
        code: `local name = "Аня"
print("Привет, " .. name .. "!")`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Что делает оператор ..?",
          options: [
            { id: "a", text: "Склеивает строки" },
            { id: "b", text: "Возводит в степень" },
            { id: "c", text: "Сравнивает" },
          ],
          correctId: "a",
          explanation: ".. — конкатенация (склейка) строк.",
        },
        {
          id: "q2",
          prompt: "Зачем слово local?",
          options: [
            { id: "a", text: "Переменная видна только в своём блоке" },
            { id: "b", text: "Ускоряет интернет" },
            { id: "c", text: "Это обязательно для чисел" },
          ],
          correctId: "a",
          explanation: "Без local переменная становится глобальной.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Создайте local-переменные name и age, выведите их одной строкой через ..",
      files: [
        {
          id: "main.lua",
          label: "main.lua",
          starter: `local name = "..."
local age = 0

-- склейка через ..\n`,
        },
      ],
      textChecks: [
        {
          checkId: "name",
          title: "local name со строкой",
          test: (h) => /local\s+name\s*=\s*["'][^"']+["']/.test(h.file("main.lua")),
          hintOk: "name найдена.",
          hintFail: 'local name = "Имя"',
        },
        {
          checkId: "age",
          title: "local age с числом",
          test: (h) => /local\s+age\s*=\s*\d+/.test(h.file("main.lua")),
          hintOk: "age найдена.",
          hintFail: "local age = 20",
        },
        {
          checkId: "concat",
          title: "Склейка через ..",
          test: (h) => /\.\./.test(h.file("main.lua")),
          hintOk: "Оператор .. найден.",
          hintFail: 'print(name .. " — " .. age)',
        },
      ],
    },
  },
];

/* Модуль 2. Условия и циклы */
const m2: Lesson[] = [
  {
    slug: "lua-if",
    title: "Условия: if / then / else",
    minutes: 15,
    summary: "Ветвления с словом then и словом end.",
    theory: [
      {
        filename: "условия.lua",
        lang: "lua" as const,
        intro:
          "Условие: if ... then ... else ... end. Каждое открытие закрывается словом end.",
        code: `local age = 20

if age >= 18 then
  print("Взрослый")
else
  print("Нет")
end`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Чем заканчивается блок if в Lua?",
          options: [
            { id: "a", text: "Словом end" },
            { id: "b", text: "Фигурной скобкой }" },
            { id: "c", text: "Ничем" },
          ],
          correctId: "a",
          explanation: "if ... then ... end — блок закрывается end.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Напишите if/else с then и end, который проверяет возраст и печатает результат.",
      files: [
        {
          id: "main.lua",
          label: "main.lua",
          starter: `local age = 20

-- if then else end\n`,
        },
      ],
      textChecks: [
        {
          checkId: "if",
          title: "Есть if ... then",
          test: (h) => /\bif\s+.+\s+then\b/.test(h.file("main.lua")),
          hintOk: "if/then найдены.",
          hintFail: "if age >= 18 then",
        },
        {
          checkId: "else",
          title: "Есть else",
          test: (h) => /\belse\b/.test(h.file("main.lua")),
          hintOk: "else найден.",
          hintFail: "Добавьте else с другой веткой.",
        },
        {
          checkId: "end",
          title: "Блок закрыт end",
          test: (h) => /\bend\b/.test(h.file("main.lua")),
          hintOk: "end найден.",
          hintFail: "Завершите блок словом end",
        },
      ],
    },
  },
  {
    slug: "lua-loops",
    title: "Циклы: for и while",
    minutes: 15,
    summary: "Числовой for с диапазоном.",
    theory: [
      {
        filename: "циклы.lua",
        lang: "lua" as const,
        intro:
          "Числовой for: for i = start, finish do ... end. Обе границы включаются!",
        code: `for i = 1, 5 do
  print(i)
end`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Сколько раз выполнится for i = 1, 5 do?",
          options: [
            { id: "a", text: "5" },
            { id: "b", text: "4" },
            { id: "c", text: "6" },
          ],
          correctId: "a",
          explanation:
            "В Lua обе границы включаются: 1,2,3,4,5 — пять раз (в отличие от range в Python).",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Выведите числа от 1 до 10 числовым for и посчитайте сумму, накапливая её в переменной.",
      files: [
        {
          id: "main.lua",
          label: "main.lua",
          starter: `local total = 0

-- for 1..10 и накопление суммы\n`,
        },
      ],
      textChecks: [
        {
          checkId: "for",
          title: "Есть числовой for",
          test: (h) => /\bfor\s+\w+\s*=\s*\d+\s*,\s*\d+\s+do\b/.test(h.file("main.lua")),
          hintOk: "for найден.",
          hintFail: "for i = 1, 10 do",
        },
        {
          checkId: "do",
          title: "Тело цикла открывается do",
          test: (h) => /\bdo\b/.test(h.file("main.lua")),
          hintOk: "do найдено.",
          hintFail: "for i = 1, 10 do",
        },
        {
          checkId: "sum",
          title: "Сумма накапливается",
          test: (h) => /total\s*=\s*total\s*\+/.test(h.file("main.lua")),
          hintOk: "Накопление найдено.",
          hintFail: "total = total + i",
        },
      ],
    },
  },
];

/* Модуль 3. Функции и таблицы */
const m3: Lesson[] = [
  {
    slug: "lua-funcs",
    title: "Функции",
    minutes: 15,
    summary: "local function, параметры, возврат значений.",
    theory: [
      {
        filename: "функции.lua",
        lang: "lua" as const,
        intro:
          "Функции объявляют словом function; return возвращает результат.",
        code: `local function greet(name)
  return "Привет, " .. name
end

print(greet("Аня"))`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Как объявляют функцию?",
          options: [
            { id: "a", text: "function имя(параметры) ... end" },
            { id: "b", text: "def имя(): ..." },
            { id: "c", text: "func имя() { ... }" },
          ],
          correctId: "a",
          explanation: "function ... end — синтаксис Lua.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Напишите функцию add(a, b), возвращающую сумму, и вызовите её.",
      files: [
        {
          id: "main.lua",
          label: "main.lua",
          starter: `-- function add(a, b) ... end\n`,
        },
      ],
      textChecks: [
        {
          checkId: "def",
          title: "function add(a, b) объявлена",
          test: (h) => /\bfunction\s+add\s*\(\s*a\s*,\s*b\s*\)/.test(h.file("main.lua")),
          hintOk: "Сигнатура верная.",
          hintFail: "function add(a, b)",
        },
        {
          checkId: "ret",
          title: "return с суммой",
          test: (h) => /\breturn\s+a\s*\+\s*b\b/.test(h.file("main.lua")),
          hintOk: "Возврат найден.",
          hintFail: "return a + b",
        },
        {
          checkId: "end",
          title: "Функция закрыта end",
          test: (h) => /\bend\b/.test(h.file("main.lua")),
          hintOk: "end найден.",
          hintFail: "Завершите функцию словом end",
        },
      ],
    },
  },
  {
    slug: "lua-tables",
    title: "Таблицы — главный тип Lua",
    minutes: 20,
    summary: "Массивы, словари — всё в одной структуре.",
    theory: [
      {
        filename: "таблицы.lua",
        lang: "lua" as const,
        intro:
          "Таблица {} — единственная структура данных в Lua: и массив, и словарь. Элементы нумеруются с 1!",
        code: `local fruits = {"яблоко", "банан"}
table.insert(fruits, "киви")
print(#fruits)        -- 3
print(fruits[1])      -- "яблоко"`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "С какого числа нумеруются элементы таблицы?",
          options: [
            { id: "a", text: "С 1" },
            { id: "b", text: "С 0" },
            { id: "c", text: "С -1" },
          ],
          correctId: "a",
          explanation: "Lua нумерует с 1 — редкость среди языков.",
        },
        {
          id: "q2",
          prompt: "Что вернёт #fruits?",
          options: [
            { id: "a", text: "Длину таблицы" },
            { id: "b", text: "Первый элемент" },
            { id: "c", text: "Ошибку" },
          ],
          correctId: "a",
          explanation: "# — оператор длины.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Создайте таблицу из трёх элементов, добавьте четвёртый через table.insert и выведите длину через #.",
      files: [
        {
          id: "main.lua",
          label: "main.lua",
          starter: `-- таблица, insert, #\n`,
        },
      ],
      textChecks: [
        {
          checkId: "table",
          title: "Есть таблица {} с элементами",
          test: (h) => /\{[^}]+,[^}]+\}/.test(h.file("main.lua")),
          hintOk: "Таблица найдена.",
          hintFail: 'local items = {"a", "b", "c"}',
        },
        {
          checkId: "insert",
          title: "Использован table.insert",
          test: (h) => /table\.insert\s*\(/.test(h.file("main.lua")),
          hintOk: "insert найден.",
          hintFail: 'table.insert(items, "d")',
        },
        {
          checkId: "len",
          title: "Длина через #",
          test: (h) => /#\s*\w+/.test(h.file("main.lua")),
          hintOk: "# найден.",
          hintFail: "print(#items)",
        },
      ],
    },
  },
];

/* Модуль 4. Мини-проект */
const m4: Lesson[] = [
  {
    slug: "lua-project",
    title: "Мини-проект: квестовый выбор",
    minutes: 25,
    summary: "Таблицы + условия + функции: мини-сцена игры.",
    theory: [
      {
        filename: "квест.lua",
        lang: "lua" as const,
        intro:
          "Игровая сцена: таблица с параметрами персонажа и функция-обработчик выбора. Так выглядят скрипты в Roblox.",
        code: `local hero = { name = "Герой", hp = 100 }

local function damage(hero, amount)
  hero.hp = hero.hp - amount
  return hero.hp
end`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Как хранят персонажа с полями?",
          options: [
            { id: "a", text: "Таблицей с ключами" },
            { id: "b", text: "Отдельными переменными" },
            { id: "c", text: "Через class" },
          ],
          correctId: "a",
          explanation: "Таблица с ключами — «словарь» персонажа.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Каркас сцены: таблица hero с полями, функция damage, уменьшающая hp, и условие if для проигрыша.",
      files: [
        {
          id: "main.lua",
          label: "main.lua",
          starter: `local hero = { name = "Герой", hp = 100 }

-- функция damage и проверка if\n`,
        },
      ],
      textChecks: [
        {
          checkId: "hero",
          title: "Таблица hero с полями",
          test: (h) => /hero\s*=\s*\{[^}]*\w+\s*=/.test(h.file("main.lua")),
          hintOk: "hero найдена.",
          hintFail: 'local hero = { name = "Герой", hp = 100 }',
        },
        {
          checkId: "func",
          title: "Есть функция damage",
          test: (h) => /\bfunction\s+damage\s*\(/.test(h.file("main.lua")),
          hintOk: "damage найдена.",
          hintFail: "local function damage(hero, amount) ... end",
        },
        {
          checkId: "if",
          title: "Есть проверка if",
          test: (h) => /\bif\s+.+\s+then\b/.test(h.file("main.lua")),
          hintOk: "Условие найдено.",
          hintFail: "if hero.hp <= 0 then ... end",
        },
      ],
    },
  },
];

export const luaCourse: Course = {
  slug: "lua",
  title: "Lua с нуля",
  tagline:
    "Скриптовый язык игр: Roblox, Love2D и встраиваемые системы. Простые правила — быстрый старт.",
  langId: "lua",
  langName: "Lua",
  accent: "#000080",
  modules: [
    { id: "lm1", title: "Основы Lua", goal: "Писать первые скрипты: print, переменные, склейка строк.", lessons: m1 },
    { id: "lm2", title: "Условия и циклы", goal: "Управлять выполнением: if/then/end, числовой for.", lessons: m2 },
    { id: "lm3", title: "Функции и таблицы", goal: "Освоить главную структуру данных Lua.", lessons: m3 },
    { id: "lm4", title: "Мини-проект", goal: "Собрать игровую сцену с персонажем.", lessons: m4 },
    luaDictModule,
  ],
};
