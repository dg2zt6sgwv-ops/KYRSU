import { card, mkQ, taskDom, taskText } from "../course-content";
import type { Lesson, Module } from "../course-content";

/* ============================================================
   HTML · Модуль «Словарь: справочник тегов и атрибутов»
   ============================================================ */

const htmlDictLessons: Lesson[] = [
  {
    slug: "html-dict-href",
    title: "Словарь: href, src, target",
    minutes: 10,
    summary: "Адреса и ссылки: что делает каждый атрибут и где он пишется.",
    theory: [
      card(
        "ссылки.html",
        "html",
        'href — атрибут-адрес тега <a>: говорит, КУДА перейдёт пользователь. Пишется внутри открывающего тега: <a href="адрес">текст</a>. Без href ссылка не кликается.',
        `<a href="https://developer.mozilla.org">Справочник</a>
<a href="#about">О проекте</a>`,
      ),
      card(
        "картинки.html",
        "html",
        'src — «источник» для <img>: путь к файлу картинки. У <a> адрес живёт в href, у <img> — в src.',
        `<img src="cat.png" alt="Рыжий кот">
<a href="cat.png">открыть картинку</a>`,
        "alt — описание картинки: его читают программы для незрячих и показывают, если файл не загрузился.",
      ),
      card(
        "target.html",
        "html",
        'target="_blank" открывает ссылку в НОВОЙ вкладке. Без этого атрибута страница открывается в текущей вкладке.',
        `<a href="https://soogy.app" target="_blank">
  Открыть в новой вкладке
</a>`,
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Что делает атрибут href?",
          "Указывает адрес, куда ведёт ссылка",
          ["Задаёт цвет ссылки", "Открывает картинку"],
          'href — «hypertext reference»: адрес перехода. Пишется в открывающем теге: <a href="...">',
        ),
        mkQ(
          "q2",
          "В каком атрибуте указывают файл картинки?",
          "src",
          ["href", "link"],
          "src = source («источник»). У ссылок адрес — href, у картинок — src.",
        ),
        mkQ(
          "q3",
          'Как открыть ссылку в новой вкладке?',
          'target="_blank"',
          ['new-tab="yes"', 'open="blank"'],
          'Пишется так: <a href="..." target="_blank">. Без target — в той же вкладке.',
        ),
      ],
    },
    task: taskDom(
      'Словарная практика: сделайте внешнюю ссылку (href начинается с https://), внутреннюю ссылку на #about и абзац с id="about".',
      {
        html: `<!-- внешняя ссылка -->
<!-- внутренняя ссылка на #about -->
<p id="about">Раздел «о проекте»</p>
`,
      },
      [
        {
          checkId: "ext",
          title: "Есть ссылка с href на https://",
          test: (h) => h.qa("a[href^='https://']").length >= 1,
          hintOk: "Внешняя ссылка найдена.",
          hintFail: '<a href="https://example.com">текст</a>',
        },
        {
          checkId: "anchor",
          title: 'Есть ссылка на "#about"',
          test: (h) => h.q("a[href='#about']") !== null,
          hintOk: "Якорная ссылка на месте.",
          hintFail: '<a href="#about">О проекте</a>',
        },
        {
          checkId: "about",
          title: 'Есть элемент с id="about"',
          test: (h) => h.q("#about") !== null,
          hintOk: "Якорь найден.",
          hintFail: 'Добавьте id="about" абзацу.',
        },
      ],
    ),
  },
  {
    slug: "html-dict-class-id",
    title: "Словарь: class и id",
    minutes: 10,
    summary: "Две главные «метки» элемента: чем отличаются и когда какую брать.",
    theory: [
      card(
        "классы.html",
        "html",
        'class — метка для ГРУППЫ элементов. Один класс можно повесить на сколько угодно тегов, а на одном элементе может быть несколько классов через пробел: class="card big".',
        `<div class="card">Первая</div>
<div class="card big">Вторая</div>`,
      ),
      card(
        "идентификаторы.html",
        "html",
        'id — уникальный идентификатор: ровно один на страницу. По нему находят элемент в JS (#main) и прыгают ссылками (#main).',
        `<header id="top">…</header>
<a href="#top">Наверх</a>`,
        "Правило: class — для стилей и повторяющихся блоков, id — для уникальных.",
      ),
      card(
        "стили.css",
        "css",
        "В CSS класс ищут через точку, id — через решётку.",
        `.card { padding: 16px; }
#top { background: navy; }`,
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Сколько элементов могут носить один и тот же class?",
          "Сколько угодно — это метка группы",
          ["Только один", "Ровно два"],
          "class — для групп: хоть на все элементы страницы.",
        ),
        mkQ(
          "q2",
          "Сколько элементов на странице могут иметь один id?",
          "Ровно один",
          ["Сколько угодно", "Не больше трёх"],
          "id уникален. Нужна ещё одна метка — берите class.",
        ),
        mkQ(
          "q3",
          'Как в CSS выбрать элемент с id="menu"?',
          "#menu",
          [".menu", "menu { }"],
          "Решётка — id, точка — class.",
        ),
      ],
    },
    task: taskDom(
      'Соберите блок div с class="card" и id="profile", внутри — заголовок h2. В CSS задайте .card любой фон.',
      {
        html: `<!-- div с классом card и id profile, внутри h2 -->
`,
        css: `.card {
  /* фон */
}
`,
      },
      [
        {
          checkId: "cls",
          title: "Есть элемент с классом card",
          test: (h) => h.q(".card") !== null,
          hintOk: "Класс на месте.",
          hintFail: '<div class="card">…</div>',
        },
        {
          checkId: "id",
          title: 'Есть элемент с id="profile"',
          test: (h) => h.q("#profile") !== null,
          hintOk: "id на месте.",
          hintFail: '<div class="card" id="profile">',
        },
        {
          checkId: "h2",
          title: "Внутри .card есть h2 с текстом",
          test: (h) => h.text(".card h2").length > 0,
          hintOk: "Заголовок найден.",
          hintFail: "Внутри блока: <h2>Профиль</h2>",
        },
        {
          checkId: "bg",
          title: "У .card задан фон",
          test: (h) => {
            const bg = h.style(".card", "background-color");
            return bg !== "" && bg !== "transparent" && !bg.startsWith("rgba(0, 0, 0, 0)");
          },
          hintOk: "Фон применён.",
          hintFail: ".card { background: …; }",
        },
      ],
    ),
  },
  {
    slug: "html-dict-img",
    title: "Словарь: img, alt, width",
    minutes: 10,
    summary: "Картинки: одиночный тег, обязательные атрибуты и размеры.",
    theory: [
      card(
        "картинка.html",
        "html",
        "<img> — одиночный тег: закрывать не нужно. Обязательные атрибуты: src (файл) и alt (описание).",
        `<img src="кот.png" alt="Рыжий кот">
<img src="logo.svg" alt="Логотип soogy">`,
      ),
      card(
        "размеры.html",
        "html",
        "Размер задают атрибутами width/height или через CSS (width: 200px). Без размеров картинка вставляется в оригинальном.",
        `<img src="кот.png" alt="Кот" width="150">`,
        "Пропорции лучше держать: задайте width — высота посчитается сама.",
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Какой тег вставляет картинку?",
          "<img>",
          ["<image>", "<pic>"],
          "<img> — одиночный тег, закрывать </img> не нужно.",
        ),
        mkQ(
          "q2",
          "Зачем нужен атрибут alt?",
          "Описание картинки для программ чтения с экрана и случая, когда файл не загрузился",
          ["Подпись под картинкой", "Ссылка на источник"],
          "alt — текстовое описание. Это и доступность, и запасной план.",
        ),
        mkQ(
          "q3",
          "Нужно ли писать закрывающий тег для <img>?",
          "Нет, <img> — одиночный тег",
          ["Да, всегда", "Только если есть alt"],
          "У одиночных тегов (img, input, br) закрывающего тега нет.",
        ),
      ],
    },
    task: taskDom(
      'Вставьте две картинки: у каждой — src и alt, а у первой — width="150".',
      {
        html: `<!-- две картинки с src и alt, у первой width="150" -->
`,
      },
      [
        {
          checkId: "count",
          title: "Картинок минимум две",
          test: (h) => h.qa("img").length >= 2,
          hintOk: "Две картинки найдены.",
          hintFail: "Добавьте ещё один <img>.",
        },
        {
          checkId: "alt",
          title: "У первой картинки есть непустой alt",
          test: (h) => {
            const alt = h.attr("img", "alt");
            return alt !== null && alt.trim() !== "";
          },
          hintOk: "Описание есть.",
          hintFail: 'Добавьте alt="описание" каждой картинке.',
        },
        {
          checkId: "width",
          title: 'У первой картинки width="150"',
          test: (h) => h.attr("img", "width") === "150",
          hintOk: "Ширина задана.",
          hintFail: 'Добавьте атрибут width="150" первому <img>.',
        },
      ],
    ),
  },
  {
    slug: "html-dict-forms",
    title: "Словарь: button, input, label",
    minutes: 12,
    summary: "Поля ввода и кнопки: атрибуты-слова, которые встречаются чаще всего.",
    theory: [
      card(
        "кнопки.html",
        "html",
        'Текст кнопки пишется МЕЖДУ тегами. type="button" ставят, когда кнопка не отправляет форму.',
        `<button type="button">Нажми</button>`,
      ),
      card(
        "поля.html",
        "html",
        "<input> — одиночный тег поля ввода. placeholder — серая подсказка внутри пустого поля, value — текущий текст поля.",
        `<input placeholder="Ваше имя">
<input type="email" placeholder="mail@example.com">`,
      ),
      card(
        "подписи.html",
        "html",
        '<label> подписывает поле: связка через for="id" — клик по подписи ставит курсор в поле.',
        `<label for="name">Имя</label>
<input id="name" placeholder="Иван">`,
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Какой атрибут показывает подсказку внутри пустого поля?",
          "placeholder",
          ["value", "hint"],
          "placeholder исчезает, как только пользователь начинает печатать.",
        ),
        mkQ(
          "q2",
          "Чем input отличается от button?",
          "input — одиночный тег, у button текст между тегами",
          ["input нельзя стилизовать", "button — одиночный тег"],
          "<input> закрывать не нужно, а текст кнопки пишется между <button> и </button>.",
        ),
        mkQ(
          "q3",
          "Что связывает label с полем ввода?",
          'for="id" поля',
          ["class", "name"],
          '<label for="name"> и <input id="name"> — одна связка.',
        ),
      ],
    },
    task: taskDom(
      'Соберите мини-форму: label с for="nick", поле input с id="nick" и placeholder, и кнопку с любым текстом.',
      {
        html: `<!-- label, input, button -->
`,
      },
      [
        {
          checkId: "label",
          title: 'Есть label с for="nick"',
          test: (h) => h.q("label[for='nick']") !== null,
          hintOk: "Подпись найдена.",
          hintFail: '<label for="nick">Ник</label>',
        },
        {
          checkId: "input",
          title: 'Есть input с id="nick" и placeholder',
          test: (h) => {
            const ph = h.attr("input#nick", "placeholder");
            return h.q("input#nick") !== null && ph !== null && ph.trim() !== "";
          },
          hintOk: "Поле на месте.",
          hintFail: '<input id="nick" placeholder="Ваш ник">',
        },
        {
          checkId: "btn",
          title: "Есть кнопка с текстом",
          test: (h) => h.text("button").length > 0,
          hintOk: "Кнопка найдена.",
          hintFail: "<button>Отправить</button>",
        },
      ],
    ),
  },
];

export const htmlDictModule: Module = {
  id: "m5",
  title: "Словарь: справочник тегов",
  goal: "Выучить главные слова HTML как словарь: что делает, где пишется, как пишется.",
  lessons: htmlDictLessons,
};

/* ============================================================
   JavaScript · Модуль «Словарь JS»
   ============================================================ */

const jsDictLessons: Lesson[] = [
  {
    slug: "js-dict-selector",
    title: "Словарь: querySelector и getElementById",
    minutes: 10,
    summary: "Два способа найти элемент на странице.",
    theory: [
      card(
        "поиск.js",
        "js",
        'document.querySelector("селектор") находит ПЕРВЫЙ элемент по любому CSS-селектору: "#id", ".class", "ul li". Если не нашёл — вернёт null.',
        `const title = document.querySelector("#title");
const card = document.querySelector(".card");`,
        'querySelectorAll("...") находит ВСЕ подходящие элементы и возвращает список.',
      ),
      card(
        "по-id.js",
        "js",
        'document.getElementById("id") — классика: ищет только по id и без решётки.',
        `const el = document.getElementById("title");`,
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Что вернёт querySelector, если элемента нет?",
          "null",
          ["Ошибку", "Пустую строку"],
          "null — «ничего не нашёл». Проверяйте результат перед использованием.",
        ),
        mkQ(
          "q2",
          'Как пишут id в getElementById?',
          'Без решётки: getElementById("title")',
          ['С решёткой: getElementById("#title")', 'С точкой: getElementById(".title")'],
          "getElementById принимает чистый id — решётка нужна только в CSS-селекторах.",
        ),
        mkQ(
          "q3",
          'Что вернёт querySelector(".item"), если на странице три элемента .item?',
          "Первый из них",
          ["Все три", "Последний"],
          "querySelector всегда возвращает первый совпавший элемент.",
        ),
      ],
    },
    task: taskText(
      'Используйте оба способа: найдите #title через querySelector и через getElementById, сохранив их в разные переменные.',
      "script.js",
      `// const a = document.querySelector(...)
// const b = document.getElementById(...)
`,
      [
        {
          checkId: "qs",
          title: 'Есть querySelector("#title")',
          test: (h) => /document\s*\.\s*querySelector\s*\(\s*["']#title["']\s*\)/.test(h.file("script.js")),
          hintOk: "querySelector найден.",
          hintFail: 'document.querySelector("#title")',
        },
        {
          checkId: "gid",
          title: 'Есть getElementById("title")',
          test: (h) => /document\s*\.\s*getElementById\s*\(\s*["']title["']\s*\)/.test(h.file("script.js")),
          hintOk: "getElementById найден.",
          hintFail: 'document.getElementById("title") — без решётки',
        },
        {
          checkId: "vars",
          title: "Результаты сохранены в переменные",
          test: (h) => (h.file("script.js").match(/(const|let)\s+\w+\s*=/g) ?? []).length >= 2,
          hintOk: "Переменные объявлены.",
          hintFail: "const a = document.querySelector(...);",
        },
      ],
    ),
  },
  {
    slug: "js-dict-events",
    title: "Словарь: addEventListener",
    minutes: 12,
    summary: "Подписка на события: имена, синтаксис, почему не onclick.",
    theory: [
      card(
        "события.js",
        "js",
        'element.addEventListener("имя события", функция) — подписка: функция запустится, когда событие случится. Частые события: "click", "input", "submit".',
        `btn.addEventListener("click", () => {
  console.log("клик!");
});`,
      ),
      card(
        "почему-не-onclick.js",
        "js",
        "Можно и btn.onclick = fn, но addEventListener лучше: на один элемент вешают сколько угодно обработчиков, а снимают их removeEventListener.",
        `btn.addEventListener("click", first);
btn.addEventListener("click", second); // обе функции сработают`,
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Какой метод подписывает элемент на событие?",
          "addEventListener",
          ["onEvent", "listen"],
          "addEventListener(событие, функция) — стандартный способ подписки.",
        ),
        mkQ(
          "q2",
          'Как называется событие клика?',
          '"click"',
          ['"press"', '"tap"'],
          'Имя события — строка: "click", "input", "submit"…',
        ),
        mkQ(
          "q3",
          "Сколько обработчиков можно повесить через addEventListener?",
          "Сколько угодно",
          ["Только один", "Не больше двух"],
          "В отличие от onclick, обработчики складываются, а не перезаписывают друг друга.",
        ),
      ],
    },
    task: taskText(
      'Подпишитесь на два события: btn.addEventListener("click", ...) и input.addEventListener("input", ...) — в обработчиках достаточно console.log.',
      "script.js",
      `const btn = document.querySelector("#go");
const input = document.querySelector("#name");

// подпишитесь на click и input
`,
      [
        {
          checkId: "click",
          title: 'Есть подписка на "click"',
          test: (h) => /addEventListener\s*\(\s*["']click["']/.test(h.file("script.js")),
          hintOk: "Клик подписан.",
          hintFail: 'btn.addEventListener("click", () => { ... });',
        },
        {
          checkId: "input",
          title: 'Есть подписка на "input"',
          test: (h) => /addEventListener\s*\(\s*["']input["']/.test(h.file("script.js")),
          hintOk: "Ввод подписан.",
          hintFail: 'input.addEventListener("input", () => { ... });',
        },
        {
          checkId: "handler",
          title: "В обработчике есть функция (стрелка или function)",
          test: (h) => /addEventListener\s*\([^)]*(=>|function)/.test(h.file("script.js")),
          hintOk: "Обработчик найден.",
          hintFail: "Вторым аргументом передайте () => { ... }",
        },
      ],
    ),
  },
  {
    slug: "js-dict-text",
    title: "Словарь: textContent, innerHTML, value",
    minutes: 10,
    summary: "Три слова для чтения и записи содержимого.",
    theory: [
      card(
        "текст.js",
        "js",
        "textContent — чистый ТЕКСТ элемента. innerHTML — разметка внутри: теги в строке станут настоящими элементами. value — текст в полях ввода (input, textarea).",
        `el.textContent = "Привет!";
box.innerHTML = "<b>Жирно</b>";
const name = input.value;`,
      ),
      card(
        "безопасность.js",
        "js",
        "innerHTML со строками от пользователя — уязвимость: туда можно впрыснуть <script>. Для обычного текста всегда берите textContent.",
        `// безопасно:
item.textContent = userName;`,
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          "Что читает текст из поля ввода?",
          "input.value",
          ["input.textContent", "input.innerHTML"],
          "У полей ввода текст живёт в .value.",
        ),
        mkQ(
          "q2",
          "Какое свойство превратит строку \"<b>привет</b>\" в настоящий жирный текст?",
          "innerHTML",
          ["textContent", "innerText"],
          "innerHTML разбирает строку как разметку.",
        ),
        mkQ(
          "q3",
          "Что безопаснее для текста от пользователя?",
          "textContent",
          ["innerHTML", "Оба одинаково"],
          "textContent не интерпретирует теги — инъекция невозможна.",
        ),
      ],
    },
    task: taskText(
      "В коде должны встретиться все три: запись .textContent, запись .innerHTML и чтение .value.",
      "script.js",
      `const el = document.querySelector("#out");
const input = document.querySelector("#name");

// используйте textContent, innerHTML и value
`,
      [
        {
          checkId: "tc",
          title: "Использован .textContent",
          test: (h) => /\.textContent/.test(h.file("script.js")),
          hintOk: "textContent найден.",
          hintFail: 'el.textContent = "…";',
        },
        {
          checkId: "ih",
          title: "Использован .innerHTML",
          test: (h) => /\.innerHTML/.test(h.file("script.js")),
          hintOk: "innerHTML найден.",
          hintFail: 'box.innerHTML = "<b>…</b>";',
        },
        {
          checkId: "val",
          title: "Использован .value",
          test: (h) => /\.value/.test(h.file("script.js")),
          hintOk: "value найден.",
          hintFail: "const text = input.value;",
        },
      ],
    ),
  },
  {
    slug: "js-dict-convert",
    title: "Словарь: Number, parseInt и шаблонные строки",
    minutes: 12,
    summary: "Строка → число, typeof, подстановка значений в текст.",
    theory: [
      card(
        "числа.js",
        "js",
        'Значение поля ввода — всегда СТРОКА. Number("5") превратит её в число, parseInt — в целое. typeof покажет тип значения.',
        `const n = Number(input.value);
console.log(typeof n); // "number"`,
      ),
      card(
        "шаблоны.js",
        "js",
        "Шаблонная строка подставляет значения внутри ${}. Кавычки — обратные (backtick `), не обычные.",
        "const name = \"Аня\";\nconsole.log(`Привет, ${name}!`);",
      ),
    ],
    quiz: {
      questions: [
        mkQ(
          "q1",
          'Что вернёт typeof "5"?',
          '"string"',
          ['"number"', '"digit"'],
          'В кавычках — строка, даже если внутри цифры.',
        ),
        mkQ(
          "q2",
          "Как подставить переменную в шаблонную строку?",
          "${name}",
          ["{name}", "{{name}}"],
          "Внутри обратных кавычек: `Привет, ${name}!`",
        ),
        mkQ(
          "q3",
          'Что вернёт Number("abc")?',
          "NaN",
          ["0", "Ошибку"],
          "NaN — «не число»: строку нельзя превратить в число.",
        ),
      ],
    },
    task: taskText(
      "Переведите строку в число (Number или parseInt) и соберите шаблонную строку с ${...}.",
      "script.js",
      `const input = document.querySelector("#age");

// Number(...) и \`шаблон с \${...}\`
`,
      [
        {
          checkId: "num",
          title: "Использован Number() или parseInt()",
          test: (h) => /(Number|parseInt)\s*\(/.test(h.file("script.js")),
          hintOk: "Преобразование найдено.",
          hintFail: "const age = Number(input.value);",
        },
        {
          checkId: "tpl",
          title: "Есть шаблонная строка с ${...}",
          test: (h) => /`[^`]*\$\{[^}]+\}[^`]*`/.test(h.file("script.js")),
          hintOk: "Шаблон найден.",
          hintFail: "console.log(`Возраст: ${age}`);",
        },
        {
          checkId: "log",
          title: "Результат выводится в console.log",
          test: (h) => /console\s*\.\s*log\s*\(/.test(h.file("script.js")),
          hintOk: "Вывод есть.",
          hintFail: "console.log(...)",
        },
      ],
    ),
  },
];

export const jsDictModule: Module = {
  id: "jm3",
  title: "Словарь JS",
  goal: "Выучить слова языка как словарь: метод → что делает, где употребляется, как пишется.",
  lessons: jsDictLessons,
};
