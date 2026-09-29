import OpenAI from "openai";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/** System prompt: школьный помощник по основам программирования, всегда по-русски. */
const SYSTEM_PROMPT = `Ты — дружелюбный помощник на бесплатной платформе письменных курсов «Кодовая База».
Ученики изучают основы программирования: HTML, CSS, JavaScript, Python, C++ или Lua.
Правила:
- Отвечай ТОЛЬКО по-русски, коротко и понятно для новичка.
- Тема вопроса — только основы программирования и текущий урок. Оффтоп (политика, медицина, знаменитости и т.п.) — вежливо откажись и верни к теме урока.
- Не выдавай готовое решение домашнего задания целиком: объясни идею, покажи похожий мини-пример, направь рассуждениями.
- Если спрашивают про правильное написание оператора или синтаксиса — дай точную запись и одну строку примера.
- Отвечай в 2–5 предложениях или коротким списком; используй markdown-код в бэктиках.`;

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

/** One assistant reply. Called from the lesson page chat. */
export const ask = action({
  args: {
    question: v.string(),
    history: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      }),
    ),
    lessonTitle: v.string(),
    courseLang: v.string(),
    taskInstruction: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Требуется вход в систему");
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Помощник временно недоступен: не настроен API-ключ. Сообщите администратору.",
      );
    }

    const openai = new OpenAI({ apiKey });

    const contextNote =
      `Ученик сейчас на уроке «${args.lessonTitle}» (язык: ${args.courseLang}).` +
      (args.taskInstruction
        ? ` Домашнее задание урока: ${args.taskInstruction}`
        : "");

    const messages: { role: "system" | "user" | "assistant"; content: string }[] =
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: contextNote },
        ...args.history.slice(-6).map((m) => m as ChatTurn),
        { role: "user", content: args.question },
      ];

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 500,
        temperature: 0.4,
      });
      return {
        ok: true as const,
        answer: completion.choices[0]?.message?.content ?? "",
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false as const, error: message };
    }
  },
});
