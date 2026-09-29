import { card, mkQ, taskText } from "../course-content";
import type { Lesson, Module } from "../course-content";

/* ============================================================
   Python · Модуль «Словарь Python»
   ============================================================ */

const pyDictLessons: Lesson[] = [
  {
    slug: "py-dict-print-f",
    title: "Словарь: print и f-строки",
    minutes: 8,
    summary: "sep, end, подстановка значений — тонкости вывода.",
    theory: [
      card(
        "print.py",
        "python",
        'print(...) печатает значения через пробел. sep меняет разделитель, end — то, что печатается в конце (по умолчанию перенос строки).',
        'print("a", "b", "c")           # a b c\nprint("a", "b", sep="-")       # a-b\nprint("загрузка", end="...")   # без переноса строки',
      ),
      card(
        "f-строки.py",
        "python",
        'f-строка подставляет значения прямо в текст: ставьте f перед кавычками и {переменную} внутри. Так пишут все отчёты и сообщения.',
        'name = "Аня"\nage = 20\nprint(f"{name}: {age} лет")\nprint(f"2 + 2 = {2 + 2}")',
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          'Что выведет print("a", "b", sep="-")?',
          "a-b",
          ["a b", "a, b"],
          "sep задаёт разделитель между значениями вместо пробела.",
        ),
        mkQ(
          "q2",
          "Как включить подстановку значений в строку?",
          'Поставить f перед кавычками: f"..."',
          ["Писать %s", "Вызвать format()"],
          'f"текст {переменная}" — современный способ.',
        ),
        mkQ(
          "q3",
          'Что сделает end=" " в print?',
          "Заменит перенос строки на пробел",
          ["Добавит пробел в начале", "Ничего"],
          "По умолчанию end = перенос строки; end=' ' печатает дальше в той же строке.",
        ),
      ],
    },
    task: taskText(
      'Выведите две строки: обычный print и f-строку с {переменной}. Добавьте один print с sep или end.',
      "main.py",
      `name = "soogy"\n\n# обычный print\n# f-строка с {name}\n# print с sep= или end=\n`,
      [
        {
          checkId: "fstr",
          title: "Есть f-строка с {…}",
          test: (h) => /f["'][^"']*\{[^}]+\}[^"']*["']/.test(h.file("main.py")),
          hintOk: "f-строка найдена.",
          hintFail: 'print(f"Привет, {name}!")',
        },
        {
          checkId: "print",
          title: "Есть минимум два вызова print",
          test: (h) => (h.file("main.py").match(/print\s*\(/g) ?? []).length >= 2,
          hintOk: "Печатаете дважды.",
          hintFail: "Добавьте второй print.",
        },
        {
          checkId: "sepend",
          title: "Использованы sep= или end=",
          test: (h) => /\b(sep|end)\s*=/.test(h.file("main.py")),
          hintOk: "Параметр печати найден.",
          hintFail: 'print("a", "b", sep="-")',
        },
      ],
    ),
  },
  {
    slug: "py-dict-input-type",
    title: "Словарь: input, int, str",
    minutes: 10,
    summary: "Ввод данных и превращение типов: где какие функции.",
    theory: [
      card(
        "ввод.py",
        "python",
        'input() читает строку с клавиатуры. Всё, что ввёл пользователь — СТРОКА, даже цифры.',
        'name = input("Имя: ")\nprint(f"Привет, {name}!")',
      ),
      card(
        "типы.py",
        "python",
        "int(x) превращает в целое число, str(x) — в строку, float(x) — в дробное. Чтобы посчитать возраст — сначала int().",
        'age = int(input("Возраст: "))\nprint(f"Через год: {age + 1}")\nprint(str(42) + "!")',
        "int(\"abc\") вызовет ошибку ValueError — строка должна быть числовой.",
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Какой тип возвращает input()?",
          "Строку (str)",
          ["Число (int)", "Зависит от ввода"],
          "input() всегда строка — числа нужно доставать через int().",
        ),
        mkQ(
          "q2",
          'Что вернёт int("42")?',
          "Число 42",
          ['Строку "42"', "Ошибку"],
          "int() превращает числовую строку в целое число.",
        ),
        mkQ(
          "q3",
          'Что случится с int("abc")?',
          "Ошибка ValueError",
          ["Вернёт 0", "Вернёт abc"],
          "Строку без цифр нельзя превратить в число — будет ошибка.",
        ),
      ],
    },
    task: taskText(
      "Прочитайте данные через input(), превратите одну строку в число через int() и используйте str() в коде.",
      "main.py",
      `# input() и int() и str()\n`,
      [
        {
          checkId: "input",
          title: "Использован input()",
          test: (h) => /\binput\s*\(/.test(h.file("main.py")),
          hintOk: "Ввод найден.",
          hintFail: 'name = input("Имя: ")',
        },
        {
          checkId: "int",
          title: "Использован int(",
          test: (h) => /\bint\s*\(/.test(h.file("main.py")),
          hintOk: "int найден.",
          hintFail: "age = int(input(...))",
        },
        {
          checkId: "str",
          title: "Использован str(",
          test: (h) => /\bstr\s*\(/.test(h.file("main.py")),
          hintOk: "str найден.",
          hintFail: "print(str(age) + \" лет\")",
        },
      ],
    ),
  },
  {
    slug: "py-dict-len-range",
    title: "Словарь: len, range, sum",
    minutes: 10,
    summary: "Функции-измерители: длина, диапазон, сумма.",
    theory: [
      card(
        "len.py",
        "python",
        "len(x) — длина: количество символов в строке или элементов в списке.",
        'print(len("питон"))    # 5\nprint(len([1, 2, 3])) # 3',
      ),
      card(
        "range.py",
        "python",
        "range(a, b) — числа от a до b-1 (верхняя граница НЕ включается). range(3) — это 0, 1, 2.",
        "for i in range(1, 4):\n    print(i)  # 1, 2, 3",
      ),
      card(
        "sum.py",
        "python",
        "sum(список) считает сумму элементов. Вместо цикла с накоплением — одна строка.",
        "nums = [1, 2, 3, 4]\nprint(sum(nums))  # 10",
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Сколько раз выполнится range(1, 5)?",
          "4 раза (1, 2, 3, 4)",
          ["5 раз", "6 раз"],
          "Верхняя граница не включается: 1..4.",
        ),
        mkQ(
          "q2",
          'Что вернёт len("мир")?',
          "3",
          ["2", "4"],
          "len считает символы строки.",
        ),
        mkQ(
          "q3",
          "Что делает sum([2, 3, 5])?",
          "Возвращает 10",
          ["Возвращает 3", "Сортирует список"],
          "sum складывает все элементы.",
        ),
      ],
    },
    task: taskText(
      "Используйте все три: len(...), range(...) в цикле for и sum(...) для списка.",
      "main.py",
      `nums = [3, 7, 2]\n\n# len, for + range, sum\n`,
      [
        {
          checkId: "len",
          title: "Использован len(",
          test: (h) => /\blen\s*\(/.test(h.file("main.py")),
          hintOk: "len найден.",
          hintFail: "print(len(nums))",
        },
        {
          checkId: "range",
          title: "Использован range(",
          test: (h) => /\brange\s*\(/.test(h.file("main.py")),
          hintOk: "range найден.",
          hintFail: "for i in range(3):",
        },
        {
          checkId: "sum",
          title: "Использован sum(",
          test: (h) => /\bsum\s*\(/.test(h.file("main.py")),
          hintOk: "sum найден.",
          hintFail: "total = sum(nums)",
        },
      ],
    ),
  },
  {
    slug: "py-dict-methods",
    title: "Словарь: методы строк и списков",
    minutes: 12,
    summary: "upper, lower, strip, append, pop — слова, которые встречаются каждый день.",
    theory: [
      card(
        "строки.py",
        "python",
        "upper() — ВЕРХНИЙ регистр, lower() — нижний, strip() — убрать пробелы по краям, replace(a, b) — заменить.",
        'word = "  Питон  "\nprint(word.strip().upper())  # ПИТОН\nprint("кот".replace("к", "р"))  # рот',
      ),
      card(
        "списки.py",
        "python",
        "append(x) — добавить в конец, pop() — взять и удалить последний, sort() — отсортировать на месте.",
        "items = [3, 1, 2]\nitems.append(9)\nitems.sort()\nprint(items)  # [1, 2, 3, 9]",
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Что делает strip()?",
          "Убирает пробелы в начале и в конце строки",
          ["Убирает все пробелы", "Разбивает строку"],
          "strip чистит только края.",
        ),
        mkQ(
          "q2",
          "Что делает append()?",
          "Добавляет элемент в конец списка",
          ["Удаляет элемент", "Сортирует список"],
          "items.append(x) кладёт x в конец.",
        ),
        mkQ(
          "q3",
          'Что вернёт "Питон".lower()?',
          '"питон"',
          ['"ПИТОН"', "Ошибку"],
          "lower приводит строку к нижнему регистру.",
        ),
      ],
    },
    task: taskText(
      "Примените к строке .upper() или .lower() и .strip(), а к списку — .append().",
      "main.py",
      `word = "  привет  "\nitems = []\n\n# методы строк и списков\n`,
      [
        {
          checkId: "case",
          title: "Использован upper() или lower()",
          test: (h) => /\.(upper|lower)\s*\(\s*\)/.test(h.file("main.py")),
          hintOk: "Регистр меняется.",
          hintFail: "word.upper()",
        },
        {
          checkId: "strip",
          title: "Использован .strip()",
          test: (h) => /\.strip\s*\(\s*\)/.test(h.file("main.py")),
          hintOk: "Пробелы по краям убираются.",
          hintFail: "word.strip()",
        },
        {
          checkId: "append",
          title: "Использован .append(",
          test: (h) => /\.append\s*\(/.test(h.file("main.py")),
          hintOk: "Добавление найдено.",
          hintFail: 'items.append("привет")',
        },
      ],
    ),
  },
];

export const pyDictModule: Module = {
  id: "pm5",
  title: "Словарь Python",
  goal: "Выучить функции и методы как словарь: что делает, когда применять, как пишется.",
  lessons: pyDictLessons,
};
