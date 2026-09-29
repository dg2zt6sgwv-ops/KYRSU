import type { Course, Lesson } from "../course-content";
import { cppDictModule } from "../dict/dict-cpp-lua";

/* Модуль 1. Синтаксис и типы */
const m1: Lesson[] = [
  {
    slug: "cpp-hello",
    title: "Первая программа и структура",
    minutes: 15,
    summary: "Обязательный каркас C++ и вывод текста.",
    theory: [
      {
        filename: "main.cpp",
        lang: "cpp" as const,
        intro:
          "C++ — компилируемый язык: каждая программа начинается с main(). include подключает библиотеки.",
        code: `#include <iostream>

int main() {
    std::cout << "Привет, мир!" << std::endl;
    return 0;
}`,
      },
      {
        filename: "вывод.cpp",
        lang: "cpp" as const,
        intro:
          "std::cout печатает через оператор <<. Можно «склеивать» несколько значений в одну строку.",
        code: `std::cout << "Сумма: " << 2 + 2 << std::endl;`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "С чего начинается выполнение программы на C++?",
          options: [
            { id: "a", text: "С функции main()" },
            { id: "b", text: "С первой строки файла" },
            { id: "c", text: "С include" },
          ],
          correctId: "a",
          explanation: "main() — точка входа любой C++ программы.",
        },
        {
          id: "q2",
          prompt: "Что делает return 0; в main?",
          options: [
            { id: "a", text: "Сообщает системе об успешном завершении" },
            { id: "b", text: "Печатает ноль" },
            { id: "c", text: "Перезапускает программу" },
          ],
          correctId: "a",
          explanation: "Код возврата 0 — «всё хорошо».",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Соберите каркас программы: include <iostream>, функция main(), вывод строки через cout и return 0.",
      files: [
        {
          id: "main.cpp",
          label: "main.cpp",
          starter: `// include, main, cout, return\n`,
        },
      ],
      textChecks: [
        {
          checkId: "include",
          title: "Подключён <iostream>",
          test: (h) => /#include\s*<iostream>/.test(h.file("main.cpp")),
          hintOk: "iostream подключён.",
          hintFail: "#include <iostream>",
        },
        {
          checkId: "main",
          title: "Есть функция main()",
          test: (h) => /\bint\s+main\s*\(\s*\)/.test(h.file("main.cpp")),
          hintOk: "main() найдена.",
          hintFail: "int main() { ... }",
        },
        {
          checkId: "cout",
          title: "Вывод через std::cout",
          test: (h) => /std::cout\s*<</.test(h.file("main.cpp")),
          hintOk: "cout найден.",
          hintFail: 'std::cout << "Привет!" << std::endl;',
        },
        {
          checkId: "return",
          title: "Есть return 0;",
          test: (h) => /return\s+0\s*;/.test(h.file("main.cpp")),
          hintOk: "return 0 найден.",
          hintFail: "Завершите main строкой return 0;",
        },
      ],
    },
  },
  {
    slug: "cpp-vars",
    title: "Типы и переменные",
    minutes: 15,
    summary: "int, double, string — данные с типами.",
    theory: [
      {
        filename: "типы.cpp",
        lang: "cpp" as const,
        intro:
          "Переменная в C++ обязана иметь тип. int — целые, double — дробные, string — строки.",
        code: `int age = 20;
double price = 9.99;
std::string name = "Аня";`,
      },
      {
        filename: "const.cpp",
        lang: "cpp" as const,
        intro: "const — значение нельзя изменить после создания. Хороший тон.",
        code: `const double PI = 3.14159;`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Какой тип для дробных чисел?",
          options: [
            { id: "a", text: "double" },
            { id: "b", text: "int" },
            { id: "c", text: "string" },
          ],
          correctId: "a",
          explanation: "double хранит числа с плавающей точкой.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Создайте три переменные: int age, double height, std::string name — и выведите их через cout.",
      files: [
        {
          id: "main.cpp",
          label: "main.cpp",
          starter: `#include <iostream>
#include <string>

int main() {
    // переменные здесь
    return 0;
}`,
        },
      ],
      textChecks: [
        {
          checkId: "int",
          title: "Есть переменная int",
          test: (h) => /\bint\s+\w+\s*=\s*\d+/.test(h.file("main.cpp")),
          hintOk: "int найден.",
          hintFail: "int age = 20;",
        },
        {
          checkId: "double",
          title: "Есть переменная double",
          test: (h) => /\bdouble\s+\w+\s*=\s*[\d.]+/.test(h.file("main.cpp")),
          hintOk: "double найден.",
          hintFail: "double height = 1.75;",
        },
        {
          checkId: "string",
          title: "Есть std::string",
          test: (h) => /std::string\s+\w+\s*=\s*"/.test(h.file("main.cpp")),
          hintOk: "string найдена.",
          hintFail: 'std::string name = "Аня";',
        },
        {
          checkId: "cout-out",
          title: "Переменные выводятся",
          test: (h) => /std::cout\s*<</.test(h.file("main.cpp")),
          hintOk: "Вывод есть.",
          hintFail: "std::cout << age << std::endl;",
        },
      ],
    },
  },
];

/* Модуль 2. Управление потоком */
const m2: Lesson[] = [
  {
    slug: "cpp-if",
    title: "Условия и логика",
    minutes: 15,
    summary: "if / else / else if, операторы сравнения.",
    theory: [
      {
        filename: "условия.cpp",
        lang: "cpp" as const,
        intro:
          "Условия в C++ как в JavaScript: скобки обязательны, тело в фигурных скобках.",
        code: `int age = 20;

if (age >= 18) {
    std::cout << "Взрослый";
} else {
    std::cout << "Нет";
}`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Как сравнивают на равенство?",
          options: [
            { id: "a", text: "==" },
            { id: "b", text: "=" },
            { id: "c", text: "equals" },
          ],
          correctId: "a",
          explanation: "== сравнивает, = присваивает.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Напишите if/else, который проверяет возраст и печатает разные сообщения.",
      files: [
        {
          id: "main.cpp",
          label: "main.cpp",
          starter: `#include <iostream>

int main() {
    int age = 20;
    // if / else здесь
    return 0;
}`,
        },
      ],
      textChecks: [
        {
          checkId: "if",
          title: "Есть if (...)",
          test: (h) => /\bif\s*\([^)]+\)\s*\{/.test(h.file("main.cpp")),
          hintOk: "if найден.",
          hintFail: "if (age >= 18) { ... }",
        },
        {
          checkId: "else",
          title: "Есть else",
          test: (h) => /\belse\s*\{/.test(h.file("main.cpp")),
          hintOk: "else найден.",
          hintFail: "} else { ... }",
        },
        {
          checkId: "couts",
          title: "Обе ветки печатают",
          test: (h) =>
            (h.file("main.cpp").match(/std::cout\s*<</g) ?? []).length >= 2,
          hintOk: "Два вывода найдены.",
          hintFail: "В каждой ветке — свой std::cout.",
        },
      ],
    },
  },
  {
    slug: "cpp-loops",
    title: "Циклы for и while",
    minutes: 15,
    summary: "Повторение блоков кода.",
    theory: [
      {
        filename: "циклы.cpp",
        lang: "cpp" as const,
        intro:
          "Классический for: инициализация; условие; шаг. Тело — в фигурных скобках.",
        code: `for (int i = 0; i < 5; i = i + 1) {
    std::cout << i << std::endl;
}`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Сколько раз выполнится for (int i = 0; i < 5; ...)?",
          options: [
            { id: "a", text: "5" },
            { id: "b", text: "4" },
            { id: "c", text: "6" },
          ],
          correctId: "a",
          explanation: "i = 0,1,2,3,4 — пять итераций.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Выведите числа от 0 до 9 циклом for и посчитайте сумму 1..10 циклом while.",
      files: [
        {
          id: "main.cpp",
          label: "main.cpp",
          starter: `#include <iostream>

int main() {
    // for и while здесь
    return 0;
}`,
        },
      ],
      textChecks: [
        {
          checkId: "for",
          title: "Есть цикл for",
          test: (h) => /\bfor\s*\([^;]+;[^;]+;[^)]+\)/.test(h.file("main.cpp")),
          hintOk: "for найден.",
          hintFail: "for (int i = 0; i < 10; i = i + 1) { ... }",
        },
        {
          checkId: "while",
          title: "Есть цикл while",
          test: (h) => /\bwhile\s*\([^)]+\)\s*\{/.test(h.file("main.cpp")),
          hintOk: "while найден.",
          hintFail: "while (n <= 10) { ... }",
        },
        {
          checkId: "sum",
          title: "Есть накопление суммы",
          test: (h) => /\bsum\s*=\s*sum\s*\+/.test(h.file("main.cpp")),
          hintOk: "Сумма накапливается.",
          hintFail: "sum = sum + n; внутри цикла.",
        },
      ],
    },
  },
];

/* Модуль 3. Функции и массивы */
const m3: Lesson[] = [
  {
    slug: "cpp-funcs",
    title: "Функции и прототипы",
    minutes: 15,
    summary: "Свои функции с типами параметров и возврата.",
    theory: [
      {
        filename: "функции.cpp",
        lang: "cpp" as const,
        intro:
          "Функция объявляется с типом возврата. C++ проверяет типы аргументов при вызове.",
        code: `int add(int a, int b) {
    return a + b;
}

int main() {
    std::cout << add(2, 3);
    return 0;
}`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Что означает int перед именем функции?",
          options: [
            { id: "a", text: "Функция возвращает целое число" },
            { id: "b", text: "Функция целочисленная внутри" },
            { id: "c", text: "Так называют main" },
          ],
          correctId: "a",
          explanation: "Тип перед именем — тип возвращаемого значения.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Напишите функцию add(int a, int b), возвращающую сумму, и вызовите её из main.",
      files: [
        {
          id: "main.cpp",
          label: "main.cpp",
          starter: `#include <iostream>

// функция add здесь

int main() {
    // вызов add
    return 0;
}`,
        },
      ],
      textChecks: [
        {
          checkId: "def",
          title: "add(int a, int b) объявлена",
          test: (h) => /\bint\s+add\s*\(\s*int\s+a\s*,\s*int\s+b\s*\)/.test(h.file("main.cpp")),
          hintOk: "Сигнатура верная.",
          hintFail: "int add(int a, int b) { return a + b; }",
        },
        {
          checkId: "ret",
          title: "Внутри return a + b",
          test: (h) => /return\s+a\s*\+\s*b\s*;/.test(h.file("main.cpp")),
          hintOk: "Возврат суммы найден.",
          hintFail: "return a + b;",
        },
        {
          checkId: "call",
          title: "Функция вызывается",
          test: (h) => /add\s*\(\s*\d+\s*,\s*\d+\s*\)/.test(h.file("main.cpp")),
          hintOk: "Вызов найден.",
          hintFail: "std::cout << add(2, 3);",
        },
      ],
    },
  },
  {
    slug: "cpp-arrays",
    title: "Массивы и векторы",
    minutes: 20,
    summary: "Наборы данных фиксированной и динамической длины.",
    theory: [
      {
        filename: "массивы.cpp",
        lang: "cpp" as const,
        intro:
          "Массив — фиксированный набор значений одного типа. vector — динамический список из библиотеки STL.",
        code: `int nums[3] = {1, 2, 3};

#include <vector>
std::vector<int> v = {1, 2, 3};
v.push_back(4);`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Чем vector лучше массива?",
          options: [
            { id: "a", text: "Может расти во время работы" },
            { id: "b", text: "Всегда быстрее" },
            { id: "c", text: "Не требует include" },
          ],
          correctId: "a",
          explanation: "vector динамический: push_back добавляет элементы.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Создайте массив или вектор из чисел и выведите все элементы циклом.",
      files: [
        {
          id: "main.cpp",
          label: "main.cpp",
          starter: `#include <iostream>

int main() {
    // массив и цикл здесь
    return 0;
}`,
        },
      ],
      textChecks: [
        {
          checkId: "arr",
          title: "Есть массив или vector",
          test: (h) => /\[\s*\d+\s*\]\s*=\s*\{|vector\s*<int>/.test(h.file("main.cpp")),
          hintOk: "Набор данных найден.",
          hintFail: "int nums[3] = {1, 2, 3}; или std::vector<int> v = {1, 2, 3};",
        },
        {
          checkId: "loop",
          title: "Есть цикл по элементам",
          test: (h) => /\bfor\s*\(/.test(h.file("main.cpp")),
          hintOk: "Цикл найден.",
          hintFail: "for (int i = 0; i < 3; i = i + 1) { ... }",
        },
        {
          checkId: "cout",
          title: "Элементы выводятся",
          test: (h) => /std::cout\s*<</.test(h.file("main.cpp")),
          hintOk: "Вывод найден.",
          hintFail: "std::cout << nums[i] << std::endl;",
        },
      ],
    },
  },
];

/* Модуль 4. Мини-проект */
const m4: Lesson[] = [
  {
    slug: "cpp-project",
    title: "Мини-проект: калькулятор",
    minutes: 25,
    summary: "Функции, ветвления и вывод результата.",
    theory: [
      {
        filename: "калькулятор.cpp",
        lang: "cpp" as const,
        intro:
          "Калькулятор: функция на каждую операцию и switch/if для выбора. Соберём каркас из условий.",
        code: `int mul(int a, int b) {
    return a * b;
}
// выбор операции — if (op == "*") ...`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Зачем выносить операции в функции?",
          options: [
            { id: "a", text: "Переиспользовать и тестировать по отдельности" },
            { id: "b", text: "Так быстрее печатать" },
            { id: "c", text: "Требование компилятора" },
          ],
          correctId: "a",
          explanation: "Функции — переиспользование и ясность.",
        },
      ],
    },
    task: {
      mode: "text" as const,
      instruction:
        "Каркас калькулятора: две функции (например add и mul) и ветвление if/else по операции в main.",
      files: [
        {
          id: "main.cpp",
          label: "main.cpp",
          starter: `#include <iostream>

// функции операций

int main() {
    // выбор операции
    return 0;
}`,
        },
      ],
      textChecks: [
        {
          checkId: "fn1",
          title: "Есть функция add",
          test: (h) => /\badd\s*\(/.test(h.file("main.cpp")) && /\breturn\b/.test(h.file("main.cpp")),
          hintOk: "add найдена.",
          hintFail: "int add(int a, int b) { return a + b; }",
        },
        {
          checkId: "fn2",
          title: "Есть вторая функция-операция",
          test: (h) => /\b(mul|sub|div)\s*\(/.test(h.file("main.cpp")),
          hintOk: "Вторая операция найдена.",
          hintFail: "int mul(int a, int b) { return a * b; }",
        },
        {
          checkId: "if",
          title: "В main есть выбор операции",
          test: (h) => /\bif\s*\(/.test(h.file("main.cpp")),
          hintOk: "Ветвление найдено.",
          hintFail: "if (op == \"*\") { ... } else { ... }",
        },
      ],
    },
  },
];

export const cppCourse: Course = {
  slug: "cpp",
  title: "C++ с нуля",
  tagline:
    "Сильная типизация и производительность: фундамент для игр, систем и олимпиад.",
  langId: "cpp",
  langName: "C++",
  accent: "#f34b7d",
  modules: [
    { id: "cm1", title: "Синтаксис и типы", goal: "Понимать каркас программы и типы данных.", lessons: m1 },
    { id: "cm2", title: "Управление потоком", goal: "Ветвления и циклы без ошибок.", lessons: m2 },
    { id: "cm3", title: "Функции и данные", goal: "Свои функции, массивы и векторы.", lessons: m3 },
    { id: "cm4", title: "Мини-проект", goal: "Собрать калькулятор на функциях.", lessons: m4 },
    cppDictModule,
  ],
};
