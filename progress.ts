import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Get current user's progress; returns a default shape when nothing stored yet. */
export const getProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const doc = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!doc) {
      return { userId, lessonSlugs: [] as string[], extraSlugs: [] as string[] };
    }
    return { ...doc, extraSlugs: doc.extraSlugs ?? [] };
  },
});

/** Mark a lesson as completed for the current user (idempotent). */
export const completeLesson = mutation({
  args: { lessonSlug: v.string() },
  handler: async (ctx, { lessonSlug }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Требуется вход в систему");
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) {
      if (existing.lessonSlugs.includes(lessonSlug)) return;
      await ctx.db.patch(existing._id, {
        lessonSlugs: [...existing.lessonSlugs, lessonSlug],
      });
    } else {
      await ctx.db.insert("progress", {
        userId,
        lessonSlugs: [lessonSlug],
      });
    }
  },
});

/** Mark an extra (bonus) task as completed for the current user (idempotent). */
export const completeExtra = mutation({
  args: { extraId: v.string() },
  handler: async (ctx, { extraId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Требуется вход в систему");
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) {
      const done = existing.extraSlugs ?? [];
      if (done.includes(extraId)) return;
      await ctx.db.patch(existing._id, { extraSlugs: [...done, extraId] });
    } else {
      await ctx.db.insert("progress", {
        userId,
        lessonSlugs: [],
        extraSlugs: [extraId],
      });
    }
  },
});

/** Un-complete a lesson (e.g. to redo the homework). */
export const resetLesson = mutation({
  args: { lessonSlug: v.string() },
  handler: async (ctx, { lessonSlug }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Требуется вход в систему");
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        lessonSlugs: existing.lessonSlugs.filter((s) => s !== lessonSlug),
      });
    }
  },
});
