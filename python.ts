import type { Course, Lesson } from "../course-content";
import { pyDictModule } from "../dict/dict-python";

/* Модуль 1. Первые шаги */
const m1: Lesson[] = [
  {
    slug: "py-hello",
    title: "Первая программа: print",
    minutes: 10,
    summary: "Запускаем интерпретатор и печатаем первые строки.",
    theory: [
      {
        filename: "main.py",
        lang: "python" as const,
        intro:
          "print() — функция вывода: она печатает всё, что стоит в скобках. Это ваш первый «инструмент».",
        code: `print("Привет, мир!")`,
      },
      {
        filename: "комментарии.py",
        lang: "python" as const,
        intro:
          "Комментарий начинается с # — Python игнорирует его, а человек читает пояснение.",
        code: `# это комментарий
print("А это код")`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Что делает print()?",
          options: [
            { id: "a", text: "Печатает на принтере" },
            { id: "b", text: "Выводит текст на экран" },
            { id: "c", text: "Создаёт файл" },
          ],
          correctId: "b",
          explanation: "print — вывод в консоль/на экран.",
        },
        {
          id: "q2",
          prompt: "Как начинается комментарий в Python?",
          options: [
            { id: "a", text: "//" },
            { id: "b", text: "#" },
            { id: "c", text: "--" },
          ],
          correctId: "b",
          explanation: "# — однострочный комментарий Python.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Напишите программу, которая печатает две строки: приветствие и ваше имя. Нужны два вызова print().",
      files: [
        {
          id: "main.py",
          label: "main.py",
          starter: `# напишите два вызова print()\n`,
        },
      ],
      textChecks: [
        {
          checkId: "two-prints",
          title: "Есть два вызова print()",
          test: (h) => (h.file("main.py").match(/print\s*\(/g) ?? []).length >= 2,
          hintOk: "Два print() найдены.",
          hintFail: "print(\"...\") — дважды, каждый на своей строке.",
        },
        {
          checkId: "strings",
          title: "В print передаются строки в кавычках",
          test: (h) => /print\s*\(\s*["'][^"']+["']\s*\)/.test(h.file("main.py")),
          hintOk: "Строки в кавычках найдены.",
          hintFail: 'Внутри скобок — текст в кавычках: print("текст")',
        },
        {
          checkId: "comments",
          title: "Есть хотя бы один комментарий",
          test: (h) => h.file("main.py").includes("#"),
          hintOk: "Комментарий на месте.",
          hintFail: "Добавьте строку-пояснение, начинающуюся с #",
        },
      ],
    },
  },
  {
    slug: "py-vars",
    title: "Переменные и типы",
    minutes: 15,
    summary: "Храним данные: числа, строки, f-строки.",
    theory: [
      {
        filename: "переменные.py",
        lang: "python" as const,
        intro:
          "Переменная — имя для значения. Создаётся присваиванием: имя = значение.",
        code: `age = 20
name = "Аня"
pi = 3.14`,
      },
      {
        filename: "f-строки.py",
        lang: "python" as const,
        intro:
          "f-строка подставляет значения переменных прямо в текст — очень удобно.",
        code: `name = "Аня"
age = 20
print(f"{name}: {age} лет")`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Как создать переменную?",
          options: [
            { id: "a", text: "x = 5" },
            { id: "b", text: "int x = 5;" },
            { id: "c", text: "let x = 5" },
          ],
          correctId: "a",
          explanation: "В Python тип писать не нужно — просто имя = значение.",
        },
        {
          id: "q2",
          prompt: "Что выведет print(f\"{2 + 2}\")?",
          options: [
            { id: "a", text: "{2 + 2}" },
            { id: "b", text: "4" },
            { id: "c", text: "2 + 2" },
          ],
          correctId: "b",
          explanation: "Внутри f-строки выражение вычисляется.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Создайте переменные name и age, затем выведите f-строкой «Имя: …, возраст: …».",
      files: [
        {
          id: "main.py",
          label: "main.py",
          starter: `name = "..."
age = 0

# выведите f-строку\n`,
        },
      ],
      textChecks: [
        {
          checkId: "name-var",
          title: "Есть переменная name",
          test: (h) => /\bname\s*=\s*["'][^"']+["']/.test(h.file("main.py")),
          hintOk: "Переменная name создана.",
          hintFail: 'name = "Ваше имя"',
        },
        {
          checkId: "age-var",
          title: "Есть числовая переменная age",
          test: (h) => /\bage\s*=\s*\d+/.test(h.file("main.py")),
          hintOk: "Переменная age создана.",
          hintFail: "age = 20 (число, без кавычек)",
        },
        {
          checkId: "fstring",
          title: "Использована f-строка с подстановкой",
          test: (h) =>
            /f["'][^"']*\{[^}]+\}[^"']*["']/.test(h.file("main.py")),
          hintOk: "f-строка найдена.",
          hintFail: 'print(f"{name}: {age}")',
        },
      ],
    },
  },
];

/* Модуль 2. Ветвления и циклы */
const m2: Lesson[] = [
  {
    slug: "py-if",
    title: "Условия: if / elif / else",
    minutes: 15,
    summary: "Программа принимает решения.",
    theory: [
      {
        filename: "условия.py",
        lang: "python" as const,
        intro:
          "if проверяет условие. Отступ в 4 пробела обязателен — он заменяет фигурные скобки.",
        code: `age = 20

if age >= 18:
    print("Взрослый")
elif age >= 13:
    print("Подросток")
else:
    print("Ребёнок")`,
      },
      {
        filename: "сравнения.py",
        lang: "python" as const,
        intro:
          "Операторы сравнения: == равно, != не равно, > < >= <=. Результат — True или False.",
        code: `print(5 > 3)   # True
print(5 == 3)  # False`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Какой оператор проверяет равенство?",
          options: [
            { id: "a", text: "=" },
            { id: "b", text: "==" },
            { id: "c", text: "===" },
          ],
          correctId: "b",
          explanation: "= присваивает, == сравнивает.",
        },
        {
          id: "q2",
          prompt: "Чем заменены фигурные скобки в Python?",
          options: [
            { id: "a", text: "Отступами" },
            { id: "b", text: "Словом then" },
            { id: "c", text: "Точкой с запятой" },
          ],
          correctId: "a",
          explanation: "Отступ (обычно 4 пробела) — часть синтаксиса Python.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Напишите проверку возраста: if печатает «18+», else печатает «<18». В коде должны быть if, else и сравнение.",
      files: [
        {
          id: "main.py",
          label: "main.py",
          starter: `age = 20

# добавьте if / else\n`,
        },
      ],
      textChecks: [
        {
          checkId: "if",
          title: "Есть блок if",
          test: (h) => /\bif\s+.+:/.test(h.file("main.py")),
          hintOk: "if найден.",
          hintFail: "if age >= 18:",
        },
        {
          checkId: "else",
          title: "Есть блок else",
          test: (h) => /\belse\s*:/.test(h.file("main.py")),
          hintOk: "else найден.",
          hintFail: "Добавьте else: с отступом внутри.",
        },
        {
          checkId: "cmp",
          title: "Есть сравнение (>= или <)",
          test: (h) => /(>=|<=|<|>)/.test(h.file("main.py")),
          hintOk: "Сравнение найдено.",
          hintFail: "Сравните age с числом: age >= 18",
        },
      ],
    },
  },
  {
    slug: "py-loops",
    title: "Циклы: for и range",
    minutes: 15,
    summary: "Повторяем действия без копипаста.",
    theory: [
      {
        filename: "циклы.py",
        lang: "python" as const,
        intro:
          "for перебирает значения. range(5) — это 0,1,2,3,4.",
        code: `for i in range(5):
    print(i)`,
      },
      {
        filename: "сумма.py",
        lang: "python" as const,
        intro: "Циклы считают суммы: накапливаем результат в переменной.",
        code: `total = 0
for i in range(1, 6):
    total = total + i
print(total)  # 15`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Сколько раз выполнится range(5)?",
          options: [
            { id: "a", text: "5" },
            { id: "b", text: "4" },
            { id: "c", text: "6" },
          ],
          correctId: "a",
          explanation: "range(5) даёт числа 0–4 — пять итераций.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Посчитайте сумму чисел от 1 до 10 циклом for и выведите результат.",
      files: [
        {
          id: "main.py",
          label: "main.py",
          starter: `total = 0

# цикл for от 1 до 10\n`,
        },
      ],
      textChecks: [
        {
          checkId: "for",
          title: "Есть цикл for",
          test: (h) => /\bfor\s+\w+\s+in\s+/.test(h.file("main.py")),
          hintOk: "for найден.",
          hintFail: "for i in range(1, 11):",
        },
        {
          checkId: "range",
          title: "Использован range",
          test: (h) => /range\s*\(\s*1\s*,\s*11\s*\)/.test(h.file("main.py")),
          hintOk: "range(1, 11) найден.",
          hintFail: "Верхняя граница не включается: range(1, 11) — это 1..10.",
        },
        {
          checkId: "print",
          title: "Результат выводится",
          test: (h) => /print\s*\(\s*total\s*\)/.test(h.file("main.py")),
          hintOk: "Вывод суммы есть.",
          hintFail: "После цикла: print(total)",
        },
      ],
    },
  },
];

/* Модуль 3. Функции и списки */
const m3: Lesson[] = [
  {
    slug: "py-funcs",
    title: "Функции: def",
    minutes: 15,
    summary: "Свои команды: параметры, return.",
    theory: [
      {
        filename: "функции.py",
        lang: "python" as const,
        intro:
          "def создаёт функцию. return возвращает результат — его можно сохранить или вывести.",
        code: `def greet(name):
    return "Привет, " + name

print(greet("Аня"))`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Что возвращает функция без return?",
          options: [
            { id: "a", text: "None" },
            { id: "b", text: "0" },
            { id: "c", text: "Ошибку" },
          ],
          correctId: "a",
          explanation: "Без return функция возвращает None.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Напишите функцию add(a, b), которая возвращает сумму, и выведите add(2, 3).",
      files: [
        {
          id: "main.py",
          label: "main.py",
          starter: `# def add(a, b): ...\n`,
        },
      ],
      textChecks: [
        {
          checkId: "def",
          title: "Функция add объявлена",
          test: (h) => /\bdef\s+add\s*\(\s*a\s*,\s*b\s*\)\s*:/.test(h.file("main.py")),
          hintOk: "def add(a, b): найден.",
          hintFail: "def add(a, b):",
        },
        {
          checkId: "return",
          title: "Есть return с суммой",
          test: (h) => /\breturn\s+\w+\s*\+\s*\w+/.test(h.file("main.py")),
          hintOk: "return a + b найден.",
          hintFail: "Внутри функции: return a + b",
        },
        {
          checkId: "call",
          title: "Функция вызывается",
          test: (h) => /add\s*\(\s*2\s*,\s*3\s*\)/.test(h.file("main.py")),
          hintOk: "Вызов add(2, 3) найден.",
          hintFail: "print(add(2, 3))",
        },
      ],
    },
  },
  {
    slug: "py-lists",
    title: "Списки",
    minutes: 15,
    summary: "Много значений в одной переменной.",
    theory: [
      {
        filename: "списки.py",
        lang: "python" as const,
        intro:
          "Список — упорядоченный набор значений в квадратных скобках. append добавляет в конец.",
        code: `fruits = ["яблоко", "банан"]
fruits.append("киви")
print(len(fruits))  # 3`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Что делает len(list)?",
          options: [
            { id: "a", text: "Возвращает длину списка" },
            { id: "b", text: "Сортирует список" },
            { id: "c", text: "Удаляет элемент" },
          ],
          correctId: "a",
          explanation: "len — количество элементов.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Создайте список из трёх элементов, добавьте четвёртый через append и выведите длину через len().",
      files: [
        {
          id: "main.py",
          label: "main.py",
          starter: `# ваш список здесь\n`,
        },
      ],
      textChecks: [
        {
          checkId: "list",
          title: "Есть список из 3+ элементов",
          test: (h) => /\[[^\\\]]+,[^\]]+,[^\]]+\]/.test(h.file("main.py")),
          hintOk: "Список найден.",
          hintFail: 'items = ["a", "b", "c"]',
        },
        {
          checkId: "append",
          title: "Использован .append(",
          test: (h) => /\.append\s*\(/.test(h.file("main.py")),
          hintOk: "append найден.",
          hintFail: "items.append(\"d\")",
        },
        {
          checkId: "len",
          title: "Есть len(...)",
          test: (h) => /\blen\s*\(/.test(h.file("main.py")),
          hintOk: "len найден.",
          hintFail: "print(len(items))",
        },
      ],
    },
  },
];

/* Модуль 4. Мини-проект */
const m4: Lesson[] = [
  {
    slug: "py-project",
    title: "Мини-проект: угадай число",
    minutes: 25,
    summary: "Комбинируем всё: цикл, условия, функции.",
    theory: [
      {
        filename: "игра.py",
        lang: "python" as const,
        intro:
          "Логика игры: секретное число и подсказки «больше/меньше». В веб-версии курса ввод не нужен — проверяем саму структуру.",
        code: `secret = 7
tries = 0

while tries < 3:
    tries = tries + 1
# угадывание — цикл с условием`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Когда завершается while tries < 3?",
          options: [
            { id: "a", text: "Когда tries станет 3 или больше" },
            { id: "b", text: "Никогда" },
            { id: "c", text: "Сразу" },
          ],
          correctId: "a",
          explanation: "while работает, пока условие истинно.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Каркас игры: переменная secret, цикл while с лимитом попыток и условие if внутри — «больше» или «меньше».",
      files: [
        {
          id: "main.py",
          label: "main.py",
          starter: `secret = 7\n\n# цикл while и if внутри\n`,
        },
      ],
      textChecks: [
        {
          checkId: "secret",
          title: "Есть переменная secret",
          test: (h) => /\bsecret\s*=\s*\d+/.test(h.file("main.py")),
          hintOk: "secret найдена.",
          hintFail: "secret = 7",
        },
        {
          checkId: "while",
          title: "Есть цикл while",
          test: (h) => /\bwhile\s+.+:/.test(h.file("main.py")),
          hintOk: "while найден.",
          hintFail: "while tries < 3:",
        },
        {
          checkId: "if-in",
          title: "Внутри есть if с печатью",
          test: (h) => /\bif\s+.+:/.test(h.file("main.py")) && /print\s*\(/.test(h.file("main.py")),
          hintOk: "Условие и вывод на месте.",
          hintFail: "Внутри цикла: if guess > secret: print(\"меньше\")",
        },
      ],
    },
  },
];

export const pythonCourse: Course = {
  slug: "python",
  title: "Python с нуля",
  tagline:
    "Самый дружелюбный язык для старта: синтаксис-конспект, автоматизация и анализ данных.",
  langId: "py",
  langName: "Python",
  accent: "#3572A5",
  modules: [
    { id: "pm1", title: "Первые шаги", goal: "Писать и запускать первые программы.", lessons: m1 },
    { id: "pm2", title: "Ветвления и циклы", goal: "Управлять ходом программы.", lessons: m2 },
    { id: "pm3", title: "Функции и списки", goal: "Структурировать код и данные.", lessons: m3 },
    { id: "pm4", title: "Мини-проект", goal: "Собрать игру «Угадай число».", lessons: m4 },
    pyDictModule,
  ],
};
