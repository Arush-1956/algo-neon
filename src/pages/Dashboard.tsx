import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Activity, TrendingUp, Zap, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const SYMBOLS = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA", "META"];

export default function Dashboard() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const portfolio = useQuery(api.portfolio.getOrCreatePortfolio);
  const trades = useQuery(api.trades.getUserTrades);
  const stats = useQuery(api.trades.getTradeStats);
  const createTrade = useMutation(api.trades.createTrade);
  const updatePortfolio = useMutation(api.portfolio.updatePortfolio);
  const createPortfolio = useMutation(api.portfolio.createPortfolio);

  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [quantity, setQuantity] = useState("10");
  const [algorithm, setAlgorithm] = useState("heap");
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
  const [isTrading, setIsTrading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const initialPrices: Record<string, number> = {};
    SYMBOLS.forEach(symbol => {
      initialPrices[symbol] = 100 + Math.random() * 400;
    });
    setMarketPrices(initialPrices);

    const interval = setInterval(() => {
      setMarketPrices(prev => {
        const updated = { ...prev };
        SYMBOLS.forEach(symbol => {
          const change = (Math.random() - 0.5) * 10;
          updated[symbol] = Math.max(10, prev[symbol] + change);
        });
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const executeTrade = async (type: "BUY" | "SELL") => {
    if (!portfolio) return;
    
    // Create portfolio if it doesn't exist yet
    if (!portfolio._id) {
      await createPortfolio();
      toast.info("Portfolio created! Please try again.");
      setIsTrading(false);
      return;
    }
    
    setIsTrading(true);
    try {
      const price = marketPrices[selectedSymbol];
      const qty = parseInt(quantity);
      const cost = price * qty;

      if (type === "BUY" && portfolio.balance < cost) {
        toast.error("Insufficient balance");
        setIsTrading(false);
        return;
      }

      const holding = portfolio.holdings.find(h => h.symbol === selectedSymbol);
      if (type === "SELL" && (!holding || holding.quantity < qty)) {
        toast.error("Insufficient holdings");
        setIsTrading(false);
        return;
      }

      await createTrade({
        symbol: selectedSymbol,
        type,
        quantity: qty,
        price,
        algorithm,
      });

      const newHoldings = [...portfolio.holdings];
      const holdingIndex = newHoldings.findIndex(h => h.symbol === selectedSymbol);

      if (type === "BUY") {
        if (holdingIndex >= 0) {
          const existing = newHoldings[holdingIndex];
          newHoldings[holdingIndex] = {
            symbol: selectedSymbol,
            quantity: existing.quantity + qty,
            avgPrice: (existing.avgPrice * existing.quantity + price * qty) / (existing.quantity + qty),
          };
        } else {
          newHoldings.push({ symbol: selectedSymbol, quantity: qty, avgPrice: price });
        }
      } else {
        if (holdingIndex >= 0) {
          newHoldings[holdingIndex].quantity -= qty;
          if (newHoldings[holdingIndex].quantity === 0) {
            newHoldings.splice(holdingIndex, 1);
          }
        }
      }

      const newBalance = type === "BUY" ? portfolio.balance - cost : portfolio.balance + cost;
      const holdingsValue = newHoldings.reduce((sum, h) => sum + h.quantity * (marketPrices[h.symbol] || h.avgPrice), 0);

      await updatePortfolio({
        balance: newBalance,
        totalValue: newBalance + holdingsValue,
        holdings: newHoldings,
      });

      toast.success(`${type} order executed: ${qty} ${selectedSymbol} @ $${price.toFixed(2)}`);
    } catch (error) {
      toast.error("Trade execution failed");
    }
    setIsTrading(false);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="relative z-10">
        <nav className="border-b border-cyan-400/30 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Zap className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
                ALGOFINANCE
              </span>
            </motion.div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-cyan-400/70">{user.email}</span>
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="border-pink-500 text-pink-500 hover:bg-pink-500/10"
              >
                LOGOUT
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="bg-black border-cyan-400/30 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  PORTFOLIO VALUE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">
                  ${portfolio?.totalValue.toFixed(2) || "0.00"}
                </div>
                <div className="text-sm text-cyan-400/70 mt-2">
                  Cash: ${portfolio?.balance.toFixed(2) || "0.00"}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-pink-500/30 shadow-[0_0_15px_rgba(255,0,128,0.3)]">
              <CardHeader>
                <CardTitle className="text-pink-500 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  TOTAL TRADES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pink-400">
                  {stats?.totalTrades || 0}
                </div>
                <div className="text-sm text-cyan-400/70 mt-2">
                  Win Rate: {stats?.winRate.toFixed(1) || 0}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-green-400/30 shadow-[0_0_15px_rgba(0,255,0,0.3)]">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  TOTAL PROFIT
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${(stats?.totalProfit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${stats?.totalProfit.toFixed(2) || "0.00"}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-black border-cyan-400/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                <CardHeader>
                  <CardTitle className="text-cyan-400">TRADING TERMINAL</CardTitle>
                  <CardDescription className="text-cyan-400/70">
                    Execute algorithmic trades
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-cyan-400/70 mb-2 block">SYMBOL</label>
                    <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                      <SelectTrigger className="bg-black border-cyan-400/30 text-cyan-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-cyan-400/30">
                        {SYMBOLS.map(symbol => (
                          <SelectItem key={symbol} value={symbol} className="text-cyan-400">
                            {symbol} - ${marketPrices[symbol]?.toFixed(2) || "0.00"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-cyan-400/70 mb-2 block">ALGORITHM</label>
                    <Select value={algorithm} onValueChange={setAlgorithm}>
                      <SelectTrigger className="bg-black border-cyan-400/30 text-cyan-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-cyan-400/30">
                        <SelectItem value="heap" className="text-cyan-400">MAX HEAP - Priority Queue</SelectItem>
                        <SelectItem value="stack" className="text-cyan-400">STACK - LIFO Strategy</SelectItem>
                        <SelectItem value="queue" className="text-cyan-400">QUEUE - FIFO Strategy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-cyan-400/70 mb-2 block">QUANTITY</label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="bg-black border-cyan-400/30 text-cyan-400"
                      min="1"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => executeTrade("BUY")}
                      disabled={isTrading}
                      className="flex-1 bg-green-500/20 border border-green-400 text-green-400 hover:bg-green-500/30"
                    >
                      <ArrowUp className="mr-2 h-4 w-4" />
                      BUY
                    </Button>
                    <Button
                      onClick={() => executeTrade("SELL")}
                      disabled={isTrading}
                      className="flex-1 bg-red-500/20 border border-red-400 text-red-400 hover:bg-red-500/30"
                    >
                      <ArrowDown className="mr-2 h-4 w-4" />
                      SELL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-black border-pink-500/30 shadow-[0_0_15px_rgba(255,0,128,0.2)]">
                <CardHeader>
                  <CardTitle className="text-pink-500">RECENT TRADES</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {trades && trades.length > 0 ? (
                      trades.slice(0, 10).map((trade) => (
                        <div
                          key={trade._id}
                          className="flex justify-between items-center p-3 border border-cyan-400/20 rounded bg-black/50"
                        >
                          <div>
                            <div className="font-bold text-cyan-400">{trade.symbol}</div>
                            <div className="text-xs text-cyan-400/70">{trade.algorithm.toUpperCase()}</div>
                          </div>
                          <div className="text-right">
                            <div className={trade.type === "BUY" ? "text-green-400" : "text-red-400"}>
                              {trade.type} {trade.quantity}
                            </div>
                            <div className="text-xs text-cyan-400/70">${trade.price.toFixed(2)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-cyan-400/50 py-8">
                        No trades yet. Start trading!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
