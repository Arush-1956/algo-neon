import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createTrade = mutation({
  args: {
    symbol: v.string(),
    type: v.union(v.literal("BUY"), v.literal("SELL")),
    quantity: v.number(),
    price: v.number(),
    algorithm: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const tradeId = await ctx.db.insert("trades", {
      userId: user._id,
      symbol: args.symbol,
      type: args.type,
      quantity: args.quantity,
      price: args.price,
      algorithm: args.algorithm,
      profit: 0,
      status: "EXECUTED",
    });

    return tradeId;
  },
});

export const getUserTrades = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("trades")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getTradeStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const trades = await ctx.db
      .query("trades")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalTrades = trades.length;
    const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
    const winRate = trades.filter(t => t.profit > 0).length / (totalTrades || 1);

    return {
      totalTrades,
      totalProfit,
      winRate: winRate * 100,
      recentTrades: trades.slice(0, 10),
    };
  },
});
