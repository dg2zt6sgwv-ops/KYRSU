# Деплой soogy на GitHub Pages + Convex (с телефона, без компьютера)

Схема: **GitHub Actions собирает сайт** при каждом пуше, **Convex** хранит данные и
пользователей, **GitHub Pages** раздаёт статику. Google-аккаунт подходит везде — и на
GitHub, и в Convex есть вход через Google.

---

## Шаг 0. Что уже готово в коде

- `vite.config.ts` — путь сборки берётся из `BASE_NAME` (имя репозитория подставит workflow).
- `src/lib/base-path.ts` — basename роутера и ссылки на `soogy.zip` учитывают префикс Pages.
- `.github/workflows/deploy.yml` — сам собирает и публикует сайт при каждом пуше в `main`.
- `mini-site/` — попадает в сборку, офлайн-версия будет доступна по `/mini-site/`.

---

## Шаг 1. Создать Convex-проект (один раз, 5 минут)

Проект создаётся в браузере, но **production-деплоймент и ключ** — одной командой из терминала.
Выберите любой вариант A или B.

### Вариант A — GitHub Codespaces (прямо в браузере, рекомендую)

1. Откройте свой репозиторий на github.com.
2. Нажмите зелёную кнопку **`<> Code`** → вкладка **Codespaces** → **Create codespace on main**.
   Откроется VS Code прямо в браузере (занимает ~1 минуту).
3. Внизу откройте терминал (меню ☰ → Terminal → New Terminal, или Ctrl+`).
4. Выполните по очереди (после каждой — Enter):

   ```bash
   npm install
   npx convex dev --once
   ```

5. На вопрос «Logged in as …» — выберите **Log in with Google**, кликните по ссылке,
   подтвердите вход в браузере и вернитесь в терминал.
6. Когда спросит имя проекта — введите `soogy` и Enter. Проект появится в dashboard.convex.dev.
7. Теперь создайте production-деплоймент (базу «для сайта»):

   ```bash
   npx convex deploy --cmd 'echo skip'
   ```

   Команда спросит подтверждение создания production-деплоймента — ответьте **yes**.
8. Получите ключ для GitHub любым способом:

   **Способ 1 — в терминале (одна команда):**

   ```bash
   npx convex deployment token create github-actions --deployment prod
   ```

   Напечатает строку вида `prod:имя-…|eyJ2YXJpY...` — это и есть ключ.

   **Способ 2 — в браузере:** dashboard.convex.dev → проект `soogy` →
   production-деплоймент → **Settings** → **Deploy keys** → **Generate** →
   имя `github-actions`, разрешение **deployment:deploy** → скопируйте.

   Ключ понадобится на шаге 2.

9. Codespaces можно закрыть: вкладка браузера → меню ☰ → **Stop Codespace** (или Delete).

### Вариант B — Termux на Android

1. Установите **Termux** из F-Droid (не из Google Play): https://f-droid.org/packages/com.termux/
2. Откройте Termux и выполните по очереди:

   ```bash
   pkg update -y && pkg upgrade -y
   pkg install -y nodejs-lts git
   termux-setup-storage
   ```

3. Скачайте проект (подставьте свой логин и имя репозитория):

   ```bash
   git clone https://github.com/ВАШ_ЛОГИН/ИМЯ_РЕПОЗИТОРИЯ.git soogy
   cd soogy
   npm install
   npx convex dev --once
   ```

4. Войдите через Google (как в варианте A), введите имя проекта `soogy`.
5. Создайте production-деплоймент и получите ключ:

   ```bash
   npx convex deploy --cmd 'echo skip'
   npx convex deployment token create github-actions --deployment prod
   ```

   После подтверждения (**yes**) вторая команда напечатает ключ `prod:...|eyJ...` —
   скопируйте его. (Тот же ключ можно взять в браузере: dashboard.convex.dev →
   проект → Settings → Deploy keys → Generate.)

---

## Шаг 2. Добавить ключ в GitHub Secrets

1. Откройте репозиторий на github.com → вкладка **Settings** (шестерёнка).
2. В левом меню: **Secrets and variables** → **Actions**.
3. Нажмите кнопку **New repository secret**.
4. В поле **Name** введите ровно: `CONVEX_DEPLOY_KEY`
5. В поле **Secret** вставьте скопированный ключ (`prod:...|...`).
6. Нажмите **Add secret**.

---

## Шаг 3. Включить GitHub Pages

1. В репозитории: **Settings** → в левом меню **Pages**.
2. В блоке **Build and deployment** → поле **Source** выберите **GitHub Actions**.
3. Больше ничего нажимать не нужно — workflow сам выложит сайт.

---

## Шаг 4. Запустить деплой

1. Убедитесь, что все файлы загружены в репозиторий (включая папку `.github/workflows/`).
2. Откройте вкладку **Actions** в репозитории.
3. Слева выберите **«Deploy soogy to GitHub Pages»** → справа кнопка **Run workflow** → **Run workflow**.
   (Либо просто сделайте любой новый push в `main` — workflow запустится сам.)
4. Подождите 3–6 минут: строка станет зелёной ✓.
5. Адрес сайта появится здесь: **Settings → Pages →** «Your site is live at
   `https://ваш-логин.github.io/имя-репозитория/`».

### Проверка деплоя

- Вкладка **Actions**: зелёная галочка = успех; красный крест = откройте запуск и
  посмотрите, на каком шаге упало (текст ошибки будет в логе).
- Частая ошибка: `CONVEX_DEPLOY_KEY` не добавлен или скопирован не полностью —
  шаг «Deploy Convex + build frontend» упадёт с «Unauthorized». Пересоздайте secret.

---

## Шаг 5. Переменные окружения Convex (внутренние)

Эти ключи живут **на стороне Convex** (не в GitHub). Они нужны бэкенд-функциям:

| Переменная | Зачем | Где взять | Куда вписать |
|---|---|---|---|
| `OPENAI_API_KEY` | AI-помощник в уроках | platform.openai.com → API keys | dashboard.convex.dev → ваш проект → Settings → Environment Variables → Add. Без него всё работает, кроме AI-помощника. |

Как добавить: **dashboard.convex.dev** → проект `soogy` → вкладка **Settings** →
**Environment Variables** → **Add** → Name: `OPENAI_API_KEY`, Value: ключ → Save.
(Если ключа нет — помощник просто вежливо откажет, ничего не сломается.)

> `VITE_CONVEX_URL` вручную прописывать **не нужно**: команда `npx convex deploy --cmd`
> сама подставит правильный адрес production-деплоймента при сборке.

---

## Итоговый чеклист

- [ ] Convex-проект создан (`npx convex dev --once` из Codespaces/Termux)
- [ ] Production-деплоймент создан, ключ `prod:...` скопирован
- [ ] Secret `CONVEX_DEPLOY_KEY` добавлен в GitHub
- [ ] Pages: Source → **GitHub Actions**
- [ ] Workflow прошёл зелёным, сайт открывается
- [ ] (Опционально) `OPENAI_API_KEY` добавлен в Convex Settings

После этого каждый новый push в `main` автоматически обновляет сайт.
