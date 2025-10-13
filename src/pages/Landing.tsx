import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Shield, Zap, ArrowRight, LineChart } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-7 w-7 text-[#FF8C00]" />
            <span className="text-2xl font-bold text-gray-900">
              KAASU
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold"
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-6 px-4 py-2 border border-[#FF8C00] rounded-full bg-orange-50">
            <span className="text-[#FF8C00] text-sm font-semibold">NSE & BSE Trading Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Smart Trading for
            <br />
            <span className="text-[#FF8C00]">Indian Stock Markets</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Trade NSE and BSE stocks with algorithmic precision. Powered by advanced data structures for optimal decision-making.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              size="lg"
              className="bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-lg px-8"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Trading
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-lg px-8"
            >
              <LineChart className="mr-2 h-5 w-5" />
              View Markets
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Why Choose Kaasu?
          </h2>
          <p className="text-gray-600">Professional trading tools for everyone</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: TrendingUp,
              title: "NSE & BSE Stocks",
              description: "Access to all major Indian stocks with real-time data and insights",
            },
            {
              icon: BarChart3,
              title: "Algorithmic Trading",
              description: "Heap, Stack, and Queue-based strategies for optimized trade execution",
            },
            {
              icon: Shield,
              title: "Secure & Reliable",
              description: "Bank-grade security with real-time portfolio tracking and reporting",
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Execute trades instantly with our high-performance trading engine",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-[#FF8C00] mb-3" />
                  <CardTitle className="text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-12"
        >
          <TrendingUp className="h-16 w-16 text-[#FF8C00] mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of traders using Kaasu for smarter stock market decisions.
          </p>
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            size="lg"
            className="bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-xl px-12 py-6"
          >
            <Zap className="mr-2 h-6 w-6" />
            Open Free Account
          </Button>
        </motion.div>
      </section>

      <footer className="border-t bg-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Kaasu. Powered by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF8C00] hover:text-[#E67E00] transition-colors"
            >
              vly.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}