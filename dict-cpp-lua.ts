import { card, mkQ, taskText } from "../course-content";
import type { Lesson, Module } from "../course-content";

/* ============================================================
   C++ · Модуль «Словарь C++»
   ============================================================ */

const cppDictLessons: Lesson[] = [
  {
    slug: "cpp-dict-include-main",
    title: "Словарь: #include, int main, return",
    minutes: 10,
    summary: "Каркас любой программы на C++ — что означает каждая его строка.",
    theory: [
      card(
        "каркас.cpp",
        "cpp",
        '#include <iostream> подключает библиотеку ввода-вывода (без неё не будет cout). int main() — точка входа: программа начинается отсюда. return 0 — «программа завершилась успешно».',
        `#include <iostream>

int main() {
    std::cout << "Привет!";
    return 0;
}`,
      ),
      card(
        "cout.cpp",
        "cpp",
        'std::cout << — печать в консоль. std::endl переносит строку. Стрелки << «толкают» данные в поток: их можно ставить цепочкой.',
        `std::cout << "Сумма: " << 2 + 2 << std::endl;`,
        "std:: — пространство имён; пока пишем его полностью, без using namespace.",
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Что делает #include <iostream>?",
          "Подключает библиотеку ввода-вывода",
          ["Печатает текст", "Создаёт переменную"],
          "Без iostream не работают std::cout и std::cin.",
        ),
        mkQ(
          "q2",
          "Где программа на C++ начинает выполняться?",
          "С функции int main()",
          ["С первой строки файла", "С функции start()"],
          "int main() — точка входа любой программы.",
        ),
        mkQ(
          "q3",
          "Что означает return 0 в main?",
          "Программа завершилась успешно",
          ["Ошибку", "Вывод нуля на экран"],
          "0 — код успешного завершения.",
        ),
      ],
    },
    task: taskText(
      "Соберите каркас: #include <iostream>, функция main, внутри — вывод через std::cout с std::endl и return 0.",
      "main.cpp",
      `// каркас программы здесь\n`,
      [
        {
          checkId: "include",
          title: "Есть #include <iostream>",
          test: (h) => /#\s*include\s*<iostream>/.test(h.file("main.cpp")),
          hintOk: "Библиотека подключена.",
          hintFail: "#include <iostream>",
        },
        {
          checkId: "main",
          title: "Есть int main()",
          test: (h) => /\bint\s+main\s*\(\s*\)/.test(h.file("main.cpp")),
          hintOk: "Точка входа найдена.",
          hintFail: "int main() { ... }",
        },
        {
          checkId: "cout",
          title: "Есть std::cout и std::endl",
          test: (h) => /std\s*::\s*cout/.test(h.file("main.cpp")) && /std\s*::\s*endl/.test(h.file("main.cpp")),
          hintOk: "Вывод оформлен.",
          hintFail: 'std::cout << "Привет!" << std::endl;',
        },
        {
          checkId: "ret",
          title: "Есть return 0",
          test: (h) => /return\s+0\s*;/.test(h.file("main.cpp")),
          hintOk: "Завершение корректное.",
          hintFail: "return 0; в конце main",
        },
      ],
    ),
  },
  {
    slug: "cpp-dict-types",
    title: "Словарь: int, double, string, bool",
    minutes: 12,
    summary: "Типы C++ — слова, которые обязательно пишут перед переменной.",
    theory: [
      card(
        "типы.cpp",
        "cpp",
        "В C++ тип переменной пишут явно: int — целые, double — дробные, bool — истина/ложь, std::string — строки.",
        `int age = 20;
double price = 9.99;
bool ok = true;
std::string name = "Аня";`,
      ),
      card(
        "const.cpp",
        "cpp",
        "const — значение нельзя менять после создания. Так фиксируют константы вроде максимумов и ставок.",
        `const int MAX_TRIES = 3;`,
        "std::string требует #include <string> в некоторых компиляторах.",
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Какой тип для дробных чисел?",
          "double",
          ["int", "float-string"],
          "double — числа с точкой: 9.99.",
        ),
        mkQ(
          "q2",
          "Что означает const?",
          "Значение нельзя изменять",
          ["Переменная только для чтения из файла", "Число"],
          "const int MAX = 10; — потом MAX = 5 будет ошибкой.",
        ),
        mkQ(
          "q3",
          "Как объявить строку?",
          'std::string name = "Аня";',
          ["str name = \"Аня\";", "String name = \"Аня\";"],
          "std::string — строка в стандартной библиотеке.",
        ),
      ],
    },
    task: taskText(
      "Объявите четыре переменные разных типов: int, double, bool и std::string.",
      "main.cpp",
      `#include <iostream>
#include <string>

int main() {
    // четыре переменных разных типов
    return 0;
}
`,
      [
        {
          checkId: "int",
          title: "Есть int-переменная",
          test: (h) => /\bint\s+\w+\s*=\s*[^;]+;/.test(h.file("main.cpp")),
          hintOk: "int найден.",
          hintFail: "int age = 20;",
        },
        {
          checkId: "double",
          title: "Есть double-переменная",
          test: (h) => /\bdouble\s+\w+\s*=\s*[^;]+;/.test(h.file("main.cpp")),
          hintOk: "double найден.",
          hintFail: "double price = 9.99;",
        },
        {
          checkId: "bool",
          title: "Есть bool-переменная",
          test: (h) => /\bbool\s+\w+\s*=\s*(true|false)\s*;/.test(h.file("main.cpp")),
          hintOk: "bool найден.",
          hintFail: "bool ok = true;",
        },
        {
          checkId: "string",
          title: "Есть std::string-переменная",
          test: (h) => /std\s*::\s*string\s+\w+\s*=\s*"[^"]*"\s*;/.test(h.file("main.cpp")),
          hintOk: "Строка найдена.",
          hintFail: 'std::string name = "Аня";',
        },
      ],
    ),
  },
  {
    slug: "cpp-dict-cin-if",
    title: "Словарь: cin, if, for",
    minutes: 12,
    summary: "Ввод, условия и циклы — управляющие слова C++.",
    theory: [
      card(
        "ввод.cpp",
        "cpp",
        "std::cin >> — чтение данных с клавиатуры в переменную. Стрелка >> направляет данные ИЗ потока В переменную.",
        `int age;
std::cin >> age;`,
      ),
      card(
        "циклы.cpp",
        "cpp",
        "Классический for состоит из трёх частей: счётчик; условие продолжения; шаг. Фигурные скобки обязательны для блока.",
        `for (int i = 0; i < 3; i++) {
    std::cout << i << std::endl;
}`,
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Что делает std::cin >> x?",
          "Читает введённое значение в переменную x",
          ["Печатает x", "Очищает x"],
          "cin — «консольный ввод», >> — направление данных в переменную.",
        ),
        mkQ(
          "q2",
          "Сколько раз выполнится for (int i = 0; i < 3; i++)?",
          "3 раза",
          ["2 раза", "4 раза"],
          "i = 0, 1, 2 — условие i < 3 перестаёт выполняться на 3.",
        ),
        mkQ(
          "q3",
          "Что делает i++?",
          "Увеличивает i на 1",
          ["Умножает на 2", "Уменьшает на 1"],
          "i++ — шаг цикла, инкремент на единицу.",
        ),
      ],
    },
    task: taskText(
      "Напишите for от 0 до 4 (i < 5) с выводом i, а также if с условием сравнения чисел.",
      "main.cpp",
      `#include <iostream>

int main() {
    // цикл for и if
    return 0;
}
`,
      [
        {
          checkId: "for",
          title: "Есть for (int i = ...; i < ...; i++)",
          test: (h) => /\bfor\s*\(\s*int\s+\w+\s*=\s*\d+\s*;\s*\w+\s*<\s*\d+\s*;\s*\w+\+\+\s*\)/.test(h.file("main.cpp")),
          hintOk: "Цикл найден.",
          hintFail: "for (int i = 0; i < 5; i++)",
        },
        {
          checkId: "if",
          title: "Есть if со сравнением",
          test: (h) => /\bif\s*\([^)]*(==|!=|<|>|<=|>=)[^)]*\)/.test(h.file("main.cpp")),
          hintOk: "Условие найдено.",
          hintFail: "if (i == 2) { ... }",
        },
        {
          checkId: "cout",
          title: "Внутри есть вывод std::cout",
          test: (h) => /std\s*::\s*cout/.test(h.file("main.cpp")),
          hintOk: "Вывод есть.",
          hintFail: "std::cout << i << std::endl;",
        },
      ],
    ),
  },
  {
    slug: "cpp-dict-vector-func",
    title: "Словарь: vector и свои функции",
    minutes: 12,
    summary: "Растущий массив и переиспользуемые блоки кода.",
    theory: [
      card(
        "вектор.cpp",
        "cpp",
        "std::vector<int> — массив, который растёт сам. push_back(v) добавляет в конец, size() — длина. Требует #include <vector>.",
        `#include <vector>

std::vector<int> nums;
nums.push_back(5);
std::cout << nums.size();  // 1`,
      ),
      card(
        "функции.cpp",
        "cpp",
        "Функция: тип результата, имя, параметры в скобках. Объявляют её ДО main — C++ читает файл сверху вниз.",
        `int square(int x) {
    return x * x;
}

int main() {
    std::cout << square(4);  // 16
    return 0;
}`,
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Что делает push_back()?",
          "Добавляет элемент в конец vector",
          ["Удаляет элемент", "Сортирует vector"],
          "nums.push_back(7) — кладёт 7 в конец.",
        ),
        mkQ(
          "q2",
          "Что возвращает size() у vector?",
          "Количество элементов",
          ["Последний элемент", "Ёмкость в байтах"],
          "size() — длина вектора.",
        ),
        mkQ(
          "q3",
          "Где объявляют функцию?",
          "До main (выше по файлу)",
          ["Только после main", "Где угодно, C++ разберётся"],
          "C++ читает сверху вниз: функция должна быть объявлена до первого вызова.",
        ),
      ],
    },
    task: taskText(
      "Объявите vector<int>, добавьте в него два числа через push_back и напишите функцию int, возвращающую значение.",
      "main.cpp",
      `#include <iostream>
#include <vector>

// функция здесь

int main() {
    // vector и push_back
    return 0;
}
`,
      [
        {
          checkId: "vector",
          title: "Есть std::vector<int>",
          test: (h) => /std\s*::\s*vector\s*<\s*int\s*>/.test(h.file("main.cpp")),
          hintOk: "Вектор объявлен.",
          hintFail: "std::vector<int> nums;",
        },
        {
          checkId: "push",
          title: "Использован push_back(",
          test: (h) => /\.push_back\s*\(\s*\d+\s*\)/.test(h.file("main.cpp")),
          hintOk: "Добавление найдено.",
          hintFail: "nums.push_back(5);",
        },
        {
          checkId: "func",
          title: "Есть своя функция с return",
          test: (h) =>
            /\b(int|double)\s+\w+\s*\([^)]*\)\s*\{[^}]*return[^}]*\}/.test(h.file("main.cpp")),
          hintOk: "Функция найдена.",
          hintFail: "int square(int x) { return x * x; }",
        },
      ],
    ),
  },
];

export const cppDictModule: Module = {
  id: "cm5",
  title: "Словарь C++",
  goal: "Запомнить ключевые слова C++: типы, потоки, циклы — что делает и как пишется.",
  lessons: cppDictLessons,
};

/* ============================================================
   Lua · Модуль «Словарь Lua»
   ============================================================ */

const luaDictLessons: Lesson[] = [
  {
    slug: "lua-dict-local-print",
    title: "Словарь: local, print, ..",
    minutes: 8,
    summary: "Переменные, вывод и склейка строк — базовые слова Lua.",
    theory: [
      card(
        "переменные.lua",
        "lua",
        "local создаёт локальную переменную (видна только здесь). Без local переменная станет глобальной — так пишут редко. Тип определяется значением, писать тип не нужно.",
        `local name = "Аня"\nlocal level = 3`,
      ),
      card(
        "склейка.lua",
        "lua",
        ".. — склейка строк (две точки). print печатает в консоль. Число Lua сам превратит в строку при склейке.",
        'local level = 3\nprint("Уровень: " .. level)  -- Уровень: 3',
        "Комментарий начинается с двух дефисов --.",
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Что делает слово local?",
          "Создаёт локальную переменную",
          ["Подключает файл", "Печатает текст"],
          "local x = 5 — переменная видна только в своём блоке.",
        ),
        mkQ(
          "q2",
          "Как склеить две строки в Lua?",
          "Через две точки: ..",
          ["Через плюс +", "Через запятую"],
          '"Уровень: " .. level — оператор конкатенации.',
        ),
        mkQ(
          "q3",
          "Как начинается комментарий?",
          "--",
          ["#", "//"],
          "Однострочный комментарий — два дефиса.",
        ),
      ],
    },
    task: taskText(
      "Создайте переменную через local и выведите склейку строки и числа через ..",
      "main.lua",
      `-- local и склейка ..\n`,
      [
        {
          checkId: "local",
          title: "Использован local",
          test: (h) => /\blocal\s+\w+\s*=/.test(h.file("main.lua")),
          hintOk: "Переменная создана.",
          hintFail: 'local name = "Аня"',
        },
        {
          checkId: "dots",
          title: "Использована склейка ..",
          test: (h) => /\.\./.test(h.file("main.lua")),
          hintOk: "Склейка найдена.",
          hintFail: 'print("Уровень: " .. level)',
        },
        {
          checkId: "print",
          title: "Есть print(",
          test: (h) => /\bprint\s*\(/.test(h.file("main.lua")),
          hintOk: "Вывод найден.",
          hintFail: "print(...)",
        },
      ],
    ),
  },
  {
    slug: "lua-dict-if-for",
    title: "Словарь: if/then/end и числовой for",
    minutes: 10,
    summary: "Блоки Lua закрываются словом end — главная особенность языка.",
    theory: [
      card(
        "условия.lua",
        "lua",
        "if условие then ... end. Блок ВСЕГДА закрывается словом end. elseif — без пробела, else — отдельно.",
        `local hp = 30\n\nif hp > 50 then\n    print("всё хорошо")\nelseif hp > 20 then\n    print("осторожно")\nelse\n    print("опасность!")\nend`,
      ),
      card(
        "цикл-for.lua",
        "lua",
        "Числовой for: for i = начало, конец do ... end — конец ВКЛЮЧАЕТСЯ (не как в Python!). Третий аргумент — шаг.",
        `for i = 1, 3 do\n    print(i)  -- 1, 2, 3\nend\n\nfor i = 10, 1, -2 do\n    print(i)  -- 10, 8, 6, 4, 2\nend`,
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Чем заканчивается блок if в Lua?",
          "Словом end",
          ["Фигурной скобкой }", "Словом endif"],
          "if ... then ... end — end закрывает каждый блок.",
        ),
        mkQ(
          "q2",
          "Сколько раз выполнится for i = 1, 5 do?",
          "5 раз (1..5 включительно)",
          ["4 раза", "6 раз"],
          "В Lua верхняя граница включается — отличие от Python!",
        ),
        mkQ(
          "q3",
          "Как пишется «иначе если»?",
          "elseif",
          ["else if", "elif"],
          "elseif — одним словом.",
        ),
      ],
    },
    task: taskText(
      "Напишите if/else с выводом и числовой for от 1 до 5 с print внутри.",
      "main.lua",
      `-- if/else и for\n`,
      [
        {
          checkId: "if",
          title: "Есть if ... then",
          test: (h) => /\bif\s+.+\s+then\b/.test(h.file("main.lua")),
          hintOk: "Условие найдено.",
          hintFail: "if hp > 50 then ... end",
        },
        {
          checkId: "else",
          title: "Есть else",
          test: (h) => /\belse\b/.test(h.file("main.lua")),
          hintOk: "Ветка else найдена.",
          hintFail: "else ... end",
        },
        {
          checkId: "for",
          title: "Есть числовой for i = a, b do",
          test: (h) => /\bfor\s+\w+\s*=\s*\d+\s*,\s*\d+\s+do\b/.test(h.file("main.lua")),
          hintOk: "Цикл найден.",
          hintFail: "for i = 1, 5 do ... end",
        },
        {
          checkId: "end",
          title: "Блоки закрыты end",
          test: (h) => (h.file("main.lua").match(/\bend\b/g) ?? []).length >= 2,
          hintOk: "end на месте.",
          hintFail: "Каждый if и for закрывается своим end.",
        },
      ],
    ),
  },
  {
    slug: "lua-dict-func-table",
    title: "Словарь: function, ipairs, pairs",
    minutes: 12,
    summary: "Свои функции и два цикла для таблиц — сердце Lua.",
    theory: [
      card(
        "функции.lua",
        "lua",
        "function имя(параметры) ... end — объявление. return возвращает результат. Функцию можно положить в переменную.",
        `local function greet(name)\n    return "Привет, " .. name\nend\n\nprint(greet("Аня"))`,
      ),
      card(
        "таблицы.lua",
        "lua",
        "Таблица {} — единственная структура данных Lua: и список, и словарь. ipairs перебирает список по номерам, pairs — все пары ключ-значение.",
        `local fruits = {"яблоко", "банан"}\nfor i, v in ipairs(fruits) do\n    print(i, v)\nend\n\nlocal stats = {hp = 100, mp = 50}\nfor key, value in pairs(stats) do\n    print(key, value)\nend`,
        "Обращение к элементу: fruits[1] — нумерация С ЕДИНИЦЫ!",
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Что перебирает ipairs?",
          "Список по порядковым номерам (1, 2, 3…)",
          ["Все пары ключ-значение", "Только числа"],
          "ipairs — для списков, pairs — для любых таблиц.",
        ),
        mkQ(
          "q2",
          "С какого числа начинается нумерация в Lua-таблицах?",
          "С 1",
          ["С 0", "С -1"],
          "fruits[1] — первый элемент. Главное отличие Lua от большинства языков!",
        ),
        mkQ(
          "q3",
          "Чем объявляют функцию?",
          "function имя() ... end",
          ["def имя():", "func имя() {}"],
          "function + end вместо фигурных скобок.",
        ),
      ],
    },
    task: taskText(
      "Создайте таблицу из трёх элементов, переберите её через for с ipairs и напишите свою function с return.",
      "main.lua",
      `-- таблица, ipairs и function\n`,
      [
        {
          checkId: "table",
          title: "Есть таблица из 3+ элементов",
          test: (h) => /\{[^}]+,[^}]+,[^}]+\}/.test(h.file("main.lua")),
          hintOk: "Таблица найдена.",
          hintFail: 'local items = {"a", "b", "c"}',
        },
        {
          checkId: "ipairs",
          title: "Использован for ... in ipairs(",
          test: (h) => /\bfor\s+\w+\s*,\s*\w+\s+in\s+ipairs\s*\(/.test(h.file("main.lua")),
          hintOk: "Цикл ipairs найден.",
          hintFail: "for i, v in ipairs(items) do",
        },
        {
          checkId: "func",
          title: "Есть своя function",
          test: (h) => /\bfunction\s+\w+\s*\([^)]*\)/.test(h.file("main.lua")),
          hintOk: "Функция объявлена.",
          hintFail: "function greet(name) ... end",
        },
        {
          checkId: "return",
          title: "Есть return внутри функции",
          test: (h) => /\breturn\s+/.test(h.file("main.lua")),
          hintOk: "return найден.",
          hintFail: "return значение внутри function",
        },
      ],
    ),
  },
];

export const luaDictModule: Module = {
  id: "lm5",
  title: "Словарь Lua",
  goal: "Выучить слова Lua: local, end, ipairs — что делает и где употребляется.",
  lessons: luaDictLessons,
};
