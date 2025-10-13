import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMarketData = query({
  args: { symbol: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.symbol !== undefined) {
      const symbol = args.symbol;
      return await ctx.db
        .query("marketData")
        .withIndex("by_symbol", (q) => q.eq("symbol", symbol))
        .first();
    }
    return await ctx.db.query("marketData").collect();
  },
});

export const updateMarketData = mutation({
  args: {
    symbol: v.string(),
    price: v.number(),
    change: v.number(),
    volume: v.number(),
    high: v.number(),
    low: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("marketData")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        price: args.price,
        change: args.change,
        volume: args.volume,
        high: args.high,
        low: args.low,
      });
    } else {
      await ctx.db.insert("marketData", args);
    }
  },
});
