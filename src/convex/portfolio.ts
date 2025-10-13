import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getOrCreatePortfolio = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const portfolio = await ctx.db
      .query("portfolios")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!portfolio) {
      return {
        userId: user._id,
        balance: 100000,
        totalValue: 100000,
        holdings: [],
        _id: "" as any,
        _creationTime: Date.now(),
      };
    }

    return portfolio;
  },
});

export const createPortfolio = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("portfolios")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("portfolios", {
      userId: user._id,
      balance: 100000,
      totalValue: 100000,
      holdings: [],
    });
  },
});

export const updatePortfolio = mutation({
  args: {
    balance: v.number(),
    totalValue: v.number(),
    holdings: v.array(v.object({
      symbol: v.string(),
      quantity: v.number(),
      avgPrice: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    let portfolio = await ctx.db
      .query("portfolios")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (portfolio) {
      await ctx.db.patch(portfolio._id, {
        balance: args.balance,
        totalValue: args.totalValue,
        holdings: args.holdings,
      });
    }
  },
});