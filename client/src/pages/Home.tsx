import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingUp, Lightbulb } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="container-page relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-semibold mb-6 border border-accent/50">
                Official Government Platform
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-primary mb-6 leading-tight">
                National <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">AI Strategy</span>
                <br />
                <span className="text-4xl lg:text-6xl text-foreground/80">2024–2027</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Building a robust ecosystem for artificial intelligence in Romania. 
                Fostering innovation, ensuring ethical compliance, and driving digital transformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                    Explore Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/compliance">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-primary/20 hover:bg-primary/5 text-primary">
                    Check Compliance
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/10 rounded-full blur-3xl -z-10 transform translate-y-12" />
              <ChatInterface />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="py-24 bg-white border-y border-border">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">Strategic Pillars</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our strategy is built on three fundamental pillars designed to accelerate adoption while maintaining safety and trust.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-t-4 border-t-blue-600 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Economic Growth</h3>
              <p className="text-muted-foreground">
                Supporting startups and enterprises in adopting AI technologies to increase productivity and competitiveness in the EU market.
              </p>
            </Card>

            <Card className="p-8 border-t-4 border-t-yellow-500 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Research & Education</h3>
              <p className="text-muted-foreground">
                Developing talent through specialized university programs and funding research centers of excellence across Romania.
              </p>
            </Card>

            <Card className="p-8 border-t-4 border-t-red-600 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ethical Framework</h3>
              <p className="text-muted-foreground">
                Implementing the EU AI Act locally. Ensuring transparent, accountable, and safe AI deployment for all citizens.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
