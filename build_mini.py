"""Собирает мини-версию soogy: mini-site/script.js = данные курсов (JSON) + рантайм.

Данные берутся из настоящих src/lib-файлов платформы. Функции-проверки заданий
сериализуются в мини-программы (ast → json) и исполняются рантаймом по правилам
verifier.ts. Бандл — esbuild. Всё офлайн: платформа целиком в 3 файлах.
"""

import ast
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
MINI = os.path.join(ROOT, "mini-site")
RUNTIME = os.path.join(MINI, "runtime.js")
OUT = os.path.join(MINI, "script.js")

COURSE_FILES = [
    "src/lib/course-data.ts",
    "src/lib/courses/python.ts",
    "src/lib/courses/javascript.ts",
    "src/lib/courses/cpp.ts",
    "src/lib/courses/lua.ts",
]

LANG_OF_SLUG = {
    "html": "html",
    "python": "python",
    "javascript": "js",
    "cpp": "cpp",
    "lua": "lua",
}


# ---------------------------------------------------------------- ast → json

def py2js_name(node):
    """Имя идентификатора: h.text, h.qa и т.п."""
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        return py2js_name(node.value) + "." + node.attr
    raise ValueError(f"name expected, got {ast.dump(node)[:120]}")


def conv(node):
    """ast → json-программа для мини-рантайма (подмножество JS)."""
    if node is None:
        return None
    if isinstance(node, ast.Constant):
        return {"k": "lit", "v": node.value}
    if isinstance(node, ast.Name):
        return {"k": "name", "n": node.id}
    if isinstance(node, ast.Attribute):
        return {"k": "get", "o": conv(node.value), "p": node.attr}
    if isinstance(node, ast.Call):
        if isinstance(node.func, ast.Attribute):
            return {
                "k": "call",
                "f": conv(node.func),
                "a": [conv(a) for a in node.args],
            }
        return {"k": "call", "f": conv(node.func), "a": [conv(a) for a in node.args]}
    if isinstance(node, ast.List):
        return {"k": "arr", "e": [conv(e) for e in node.elts]}
    if isinstance(node, ast.BinOp):
        op = {
            ast.Add: "+", ast.Sub: "-", ast.Mult: "*", ast.Div: "/",
            ast.Mod: "%", ast.LShift: "<<", ast.RShift: ">>",
            ast.BitOr: "|", ast.BitAnd: "&",
        }[type(node.op)]
        return {"k": "bin", "op": op, "l": conv(node.left), "r": conv(node.right)}
    if isinstance(node, ast.BoolOp):
        return {
            "k": "log",
            "op": "&&" if isinstance(node.op, ast.And) else "||",
            "l": conv(node.values[0]),
            "r": conv(node.values[1]),
        }
    if isinstance(node, ast.UnaryOp):
        op = {ast.Not: "!", ast.USub: "-", ast.Invert: "~"}[type(node.op)]
        return {"k": "un", "op": op, "e": conv(node.operand)}
    if isinstance(node, ast.Compare):
        left = conv(node.left)
        for op_node, comp in zip(node.ops, node.comparators):
            op = {
                ast.Eq: "===", ast.NotEq: "!==", ast.Lt: "<", ast.LtE: "<=",
                ast.Gt: ">", ast.GtE: ">=", ast.In: "in",
            }[type(op_node)]
            left = {"k": "bin", "op": op, "l": left, "r": conv(comp)}
        return left
    if isinstance(node, ast.Subscript):
        return {"k": "idx", "o": conv(node.value), "i": conv(node.slice)}
    if isinstance(node, ast.Tuple):
        return {"k": "arr", "e": [conv(e) for e in node.elts]}
    raise ValueError(f"unsupported node: {ast.dump(node)[:160]}")


def conv_lambda(fn_node):
    """lambda h: expr → json-программа."""
    body = fn_node.body
    # Лёгкое разворачивание and-цепочек остаётся как log-узлы — рантайм умеет.
    return conv(body)


def expr_src(fn_node):
    """Обратно в исходник выражения — для ошибок."""
    return ast.unparse(fn_node)[:200]


def serialize_check(fn_node, check_id, title, hint_ok, hint_fail):
    try:
        prog = conv_lambda(fn_node)
    except ValueError as e:
        print(f"  !! check {check_id}: {e} — {expr_src(fn_node)}", file=sys.stderr)
        prog = {"k": "lit", "v": False}
    check = {"checkId": check_id, "title": title, "prog": prog, "hintOk": hint_ok}
    if hint_fail is not None:
        check["hintFail"] = hint_fail
    return check


def serialize_task(task):
    """CodeTask → json (mode, instruction, стартеры, файлы, проверки-программы)."""
    mode = task.get("mode") or "dom"
    out = {"mode": mode, "instruction": task.get("instruction", "")}
    if mode == "text":
        out["files"] = [
            {"id": f["id"], "label": f.get("label", f["id"]), "starter": f.get("starter", "")}
            for f in task.get("files") or []
        ]
        checks = task.get("textChecks") or []
    else:
        out["starterHtml"] = task.get("starterHtml") or ""
        out["starterCss"] = task.get("starterCss") or ""
        out["starterJs"] = task.get("starterJs") or ""
        checks = task.get("checks") or []
    out["checks"] = [
        serialize_check(
            c["test"], c["checkId"], c.get("title", c["checkId"]),
            c.get("hintOk", "Выполнено."), c.get("hintFail"),
        )
        for c in checks
    ]
    return out


def serialize_lesson(l):
    out = {"slug": l["slug"], "title": l["title"], "minutes": l.get("minutes", 10),
           "summary": l.get("summary", ""), "theory": l.get("theory", [])}
    q = l.get("quiz")
    if q:
        out["quiz"] = {"questions": [
            {"id": qq["id"], "prompt": qq["prompt"], "options": qq["options"],
             "correctId": qq["correctId"], "explanation": qq["explanation"]}
            for qq in q["questions"]
        ]}
    if l.get("task"):
        out["task"] = serialize_task(l["task"])
    return out


def serialize_course(mod, slug):
    course = mod.course
    return {
        "slug": course["slug"],
        "title": course["title"],
        "tagline": course["tagline"],
        "langId": course["langId"],
        "langName": course["langName"],
        "accent": course["accent"],
        "modules": [
            {"id": m["id"], "title": m["title"], "goal": m["goal"],
             "lessons": [serialize_lesson(l) for l in m["lessons"]]}
            for m in course["modules"]
        ],
    }


# ---------------------------------------------------------------------- main

def main():
    # 1. Данные курсов: transpile TS → JS и импортируем как ESM.
    transpiled = []
    for src in COURSE_FILES:
        with open(os.path.join(ROOT, src), "r", encoding="utf-8") as f:
            code = f.read()
        transpiled.append(
            subprocess.run(
                ["node", "-e",
                 "const es=require('esbuild');"
                 "let s='';process.stdin.on('data',d=>s+=d);"
                 "process.stdin.on('end',()=>{"
                 "process.stdout.write(es.transformSync(s,{loader:'ts',format:'esm'}));"
                 "});"],
                input=code, capture_output=True, text=True, check=True,
            ).stdout
        )

    # Склеиваем: dict-файлы определяют модули, курсовые — собирают course-объекты.
    combined = "\n".join(transpiled)
    combined += "\nglobalThis.__COURSES = [course, pythonCourse, jsCourse, cppCourse, luaCourse];\n"
    combined += "globalThis.__EXTRAS = extraTasks;\n"

    # Убираем `import type`-артефакты не нужно: esbuild их вырезает.
    # Экспорт-имена совпадают с исходниками (course, pythonCourse, ...).
    bundle = combined.replace("export const course =", "const course =")
    for name in ("pythonCourse", "jsCourse", "cppCourse", "luaCourse"):
        bundle = bundle.replace(f"export const {name} =", f"const {name} =")
    # dict-модули: импорты внутри файлов после transpile остаются ESM-import —
    # мы удаляем их и оставляем все определения в одном скопе.
    cleaned = []
    for line in bundle.splitlines():
        s = line.strip()
        if s.startswith("import ") or s.startswith("import{"):
            continue
        cleaned.append(line)
    bundle = "\n".join(cleaned)

    data_path = os.path.join(MINI, ".courses.tmp.mjs")
    with open(data_path, "w", encoding="utf-8") as f:
        f.write(bundle)

    import platform
    if platform.system() == "Windows":
        node_prefix = ["node"]
    else:
        node_prefix = ["node"]

    extract = (
        "import('./.courses.tmp.mjs').then(async (m) => {"
        "const { verifyCodeTask } = await import('./.mini-verifier.mjs');"
        "const courses = globalThis.__COURSES.map((c, i) => ({"
        "meta: m.default ? null : null, raw: c }));"
        "process.stdout.write('OK');});"
    )

    # 2. Достаём JSON через node: сериализация проверок выполняется в Python-части,
    #    но курсы приходят из JS — поэтому ходим в node один раз.
    node_script = r"""
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT = process.cwd();
const MINI = path.join(ROOT, 'mini-site');

// --- transpile каждого TS-файла и собрать общий ESM-источник
const files = %COURSE_FILES%;
let combined = '';
for (const rel of files) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const js = esbuild.transformSync(src, { loader: 'ts', format: 'esm' });
  combined += js + '\n';
}
combined += "globalThis.__COURSES = [course, pythonCourse, jsCourse, cppCourse, luaCourse];\n";
combined += "globalThis.__EXTRAS = extraTasks;\n";

fs.mkdirSync(MINI, { recursive: true });
const tmp = path.join(MINI, '.data.tmp.mjs');
fs.writeFileSync(tmp, combined);

const { courses, extras } = await import(tmp);
fs.unlinkSync(tmp);
fs.writeFileSync(path.join(MINI, '.courses.json'), JSON.stringify({ courses, extras }));
console.log('courses:', courses.length, '| lessons:', courses.reduce((n, c) => n + c.modules.reduce((k, m) => k + m.lessons.length, 0), 0));
"""
    node_script = node_script.replace("%COURSE_FILES%", json.dumps(COURSE_FILES))
    # top-level await недоступен в CJS-обёртке node -e — пишем во временный .mjs
    loader_path = os.path.join(MINI, ".extract.cjs")
    with open(loader_path, "w", encoding="utf-8") as f:
        f.write(node_script.replace("await import(tmp);", ""))
    os.remove(loader_path) if os.path.exists(loader_path) else None

    # Простой путь: node --input-type=module -e не поддерживает await import файла,
    # поэтому создаём временный .mjs-раннер.
    runner = os.path.join(MINI, ".extract.mjs")
    with open(runner, "w", encoding="utf-8") as f:
        f.write(node_script)
    res = subprocess.run(["node", runner], capture_output=True, text=True, cwd=ROOT)
    if res.returncode != 0:
        print(res.stdout, res.stderr, sep="\n", file=sys.stderr)
        sys.exit(1)
    print(res.stdout.strip())
    os.remove(runner)

    with open(os.path.join(MINI, ".courses.json"), "r", encoding="utf-8") as f:
        payload = json.load(f)

    # 3. Сериализуем проверки: пробегаем курсы в JS-представлении и заменяем
    #    функции на json-программы. Функции приходят как настоящие JS-функции —
    #    мы не можем их распечатать, поэтому проверки берем из ИСХОДНИКОВ (ast).
    #    Строим индекс по (courseSlug, lessonSlug, task) и extra id.
    src_checks = {}
    for rel in COURSE_FILES + ["src/lib/extras.ts"]:
        src = open(os.path.join(ROOT, rel), "r", encoding="utf-8").read()
        src_checks[rel] = ast.parse(src)

    def walk_checks(tree, mode_hint):
        """Ищет вызовы taskDom/taskText и возвращает сериализованные проверки."""
        found = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and getattr(node.func, "id", None) in ("taskDom", "taskText"):
                mode = "text" if node.func.id == "taskText" else "dom"
                args = node.args
                instruction = ast.literal_eval(args[0]) if args else ""
                # starter / files
                task_json = {"mode": mode, "instruction": instruction}
                if mode == "text":
                    file_id = ast.literal_eval(args[1])
                    starter = ast.literal_eval(args[2])
                    task_json["files"] = [{"id": file_id, "label": file_id, "starter": starter}]
                    checks_node = args[3]
                else:
                    starter_node = args[1]
                    task_json["starterHtml"] = starter_json("html", starter_node)
                    task_json["starterCss"] = starter_json("css", starter_node)
                    task_json["starterJs"] = starter_json("js", starter_node)
                    checks_node = args[2]
                checks = []
                for el in checks_node.elts:
                    d = {kw.arg: kw.value for kw in el.keywords}
                    check_id = ast.literal_eval(d["checkId"])
                    title = ast.literal_eval(d["title"])
                    hint_ok = ast.literal_eval(d["hintOk"]) if "hintOk" in d else "Выполнено."
                    hint_fail = ast.literal_eval(d["hintFail"]) if "hintFail" in d else None
                    checks.append(serialize_check(d["test"], check_id, title, hint_ok, hint_fail))
                task_json["checks"] = checks
                found.append(task_json)
        return found

    def starter_json(key, node):
        """taskDom(..., { html: `...`, css: ... }, ...) → строка стартера."""
        for kw in node.keywords:
            if kw.arg == key:
                return ast.literal_eval(kw.value)
        return ""

    all_tasks = []
    for rel in COURSE_FILES:
        all_tasks += walk_checks(src_checks[rel], None)
    extra_tasks_json = walk_checks(src_checks["src/lib/extras.ts"], None)

    # 4. Собираем финальные данные: курсы из JSON + проверки по instruction-ключу.
    def attach(tasks_pool):
        by_instr = {}
        for t in tasks_pool:
            by_instr.setdefault(t["instruction"], t)
        return by_instr

    lesson_checks = attach(all_tasks)
    extra_checks = attach(extra_tasks_json)

    def patch_task(task_json, pool):
        src = pool.get(task_json.get("instruction"))
        if not src:
            print("  !! нет проверок для:", task_json.get("instruction", "")[:60], file=sys.stderr)
            return task_json
        return {**task_json, "checks": src["checks"], "mode": src["mode"]}

    for c in payload["courses"]:
        for m in c["modules"]:
            for l in m["lessons"]:
                if l.get("task"):
                    patch_task(l["task"], lesson_checks)
                # Quiz-вопросы уже в JSON.
    for i, ex in enumerate(payload["extras"]):
        if ex.get("task"):
            patch_task(ex["task"], extra_checks)

    # 5. Рантайм + данные → один script.js через esbuild (минификация выключена).
    with open(RUNTIME, "r", encoding="utf-8") as f:
        runtime = f.read()
    data_js = "const DATA = " + json.dumps(payload, ensure_ascii=False) + ";\n"
    bundle_src = data_js + runtime
    res2 = subprocess.run(
        ["node", "-e",
         "const es=require('esbuild');let s='';"
         "process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{"
         "process.stdout.write(es.buildSync({stdin:{contents:s,resolveDir:'.',loader:'js'},"
         "bundle:true,minify:false,write:false,format:'iife'}).outputFiles[0].text);});"],
        input=bundle_src, capture_output=True, text=True,
    )
    if res2.returncode != 0:
        print(res2.stderr, file=sys.stderr)
        sys.exit(1)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(res2.stdout)

    n_lessons = sum(len(m["lessons"]) for c in payload["courses"] for m in c["modules"])
    n_quiz = sum(1 for c in payload["courses"] for m in c["modules"] for l in m["lessons"] if l.get("quiz"))
    n_task = sum(1 for c in payload["courses"] for m in c["modules"] for l in m["lessons"] if l.get("task"))
    print(f"script.js: {os.path.getsize(OUT) // 1024} KB | курсов: {len(payload['courses'])} | "
          f"уроков: {n_lessons} | квизов: {n_quiz} | домашек: {n_task} | допок: {len(payload['extras'])}")
    # прибираемся
    for p in (data_path, os.path.join(MINI, ".courses.json")):
        if os.path.exists(p):
            os.remove(p)


if __name__ == "__main__":
    main()
