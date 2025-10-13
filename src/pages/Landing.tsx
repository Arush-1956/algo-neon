import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Activity, ArrowRight, BarChart3, Cpu, Zap, TrendingUp, Code2 } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent" />
      
      <div className="relative z-10">
        <nav className="border-b border-cyan-400/30 bg-black/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Zap className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
                ALGOFINANCE
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all"
              >
                {isAuthenticated ? "DASHBOARD" : "GET STARTED"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </nav>

        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6 px-4 py-2 border border-pink-500/50 rounded-full bg-pink-500/10">
              <span className="text-pink-500 text-sm font-bold">TRADING MEETS DSA</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-green-400 animate-pulse">
                ALGORITHMIC
              </span>
              <br />
              <span className="text-white" style={{ textShadow: "0 0 20px rgba(0,255,255,0.5), 2px 2px 0 rgba(255,0,128,0.3)" }}>
                TRADING PLATFORM
              </span>
            </h1>
            
            <p className="text-xl text-cyan-400/70 mb-8 max-w-2xl mx-auto">
              Harness the power of data structures and algorithms for real-time trading decisions.
              <br />
              <span className="text-pink-500">Heaps. Stacks. Queues. Profit.</span>
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold text-lg px-8 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all"
              >
                <Zap className="mr-2 h-5 w-5" />
                START TRADING
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-bold text-lg px-8"
              >
                <Code2 className="mr-2 h-5 w-5" />
                VIEW ALGORITHMS
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
              CORE FEATURES
            </h2>
            <p className="text-cyan-400/70">Powered by cutting-edge algorithms</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                title: "MAX HEAP PRIORITY",
                description: "Prioritize high-value trades using max heap data structures for optimal profit extraction",
                color: "cyan",
              },
              {
                icon: BarChart3,
                title: "STACK STRATEGIES",
                description: "LIFO-based trading strategies that capitalize on recent market movements and trends",
                color: "pink",
              },
              {
                icon: Cpu,
                title: "QUEUE EXECUTION",
                description: "FIFO order processing ensures fair and systematic trade execution at scale",
                color: "green",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className={`bg-black border-${feature.color}-400/30 shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,0,128,0.4)] transition-all h-full`}>
                  <CardHeader>
                    <feature.icon className={`h-12 w-12 text-${feature.color}-400 mb-4`} />
                    <CardTitle className={`text-${feature.color}-400`}>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-cyan-400/70">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
              ALGORITHMIC ADVANTAGE
            </h2>
            <p className="text-cyan-400/70">Why DSA matters in volatile markets</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "REAL-TIME OPTIMIZATION",
                description: "O(log n) heap operations ensure lightning-fast trade prioritization even during market chaos",
                metric: "< 1ms",
              },
              {
                title: "MEMORY EFFICIENT",
                description: "Stack and queue implementations minimize memory overhead while maximizing throughput",
                metric: "O(1) space",
              },
              {
                title: "SCALABLE EXECUTION",
                description: "Handle thousands of concurrent trades with algorithmic precision and zero bottlenecks",
                metric: "10K+ TPS",
              },
              {
                title: "PROFIT MAXIMIZATION",
                description: "Data-driven strategies that adapt to market conditions using proven CS fundamentals",
                metric: "↑ 23% ROI",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black border-pink-500/30 shadow-[0_0_15px_rgba(255,0,128,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-pink-500">{item.title}</CardTitle>
                      <span className="text-2xl font-bold text-green-400">{item.metric}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyan-400/70">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-cyan-500/10 via-pink-500/10 to-green-500/10 border border-cyan-400/30 rounded-lg p-12"
          >
            <TrendingUp className="h-16 w-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4 text-white">
              READY TO OPTIMIZE YOUR TRADES?
            </h2>
            <p className="text-xl text-cyan-400/70 mb-8 max-w-2xl mx-auto">
              Join the algorithmic revolution. Start trading with the power of computer science.
            </p>
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-cyan-500 text-black font-bold text-xl px-12 py-6 hover:shadow-[0_0_40px_rgba(255,0,128,0.8)] transition-all"
            >
              <Zap className="mr-2 h-6 w-6" />
              LAUNCH TERMINAL
            </Button>
          </motion.div>
        </section>

        <footer className="border-t border-cyan-400/30 bg-black/80 backdrop-blur-sm py-8 mt-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-cyan-400/50 text-sm">
              © 2024 ALGOFINANCE. Powered by{" "}
              <a
                href="https://vly.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-400 transition-colors"
              >
                vly.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}