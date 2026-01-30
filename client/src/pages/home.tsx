import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Shield, LayoutDashboard, BookOpen, Activity, AlertTriangle, CheckCircle } from "lucide-react";

export default function Home() {
  const { data: goals = [] } = useQuery<any[]>({ queryKey: [api.strategyGoals.list.path] });
  const { data: projects = [] } = useQuery<any[]>({ queryKey: [api.projects.list.path] });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 border-l-4 border-primary pl-6 py-2 bg-primary/20 rounded-r-lg shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Security Command Center
        </h1>
        <p className="text-foreground/90 text-lg max-w-2xl font-medium">
          Deterministic compliance monitoring for national and international AI safety standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-600 shadow-md bg-card border-t border-r border-b">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground/80">Monitoring</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{projects.length} Active</div>
            <CardDescription className="mt-1 text-foreground/70 font-medium">Compliance streams live</CardDescription>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-600 shadow-md bg-card border-t border-r border-b">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground/80">Threat Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">Secure</div>
            <CardDescription className="mt-1 text-foreground/70 font-medium">Zero unacceptable violations</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600 shadow-md bg-card border-t border-r border-b">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground/80">Alert Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">Locked</div>
            <CardDescription className="mt-1 text-foreground/70 font-medium">System in archive mode</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600 shadow-md bg-card border-t border-r border-b">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground/80">System Grid</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground font-bold uppercase text-[10px]">Port:</span> <span className="font-black">5000</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground font-bold uppercase text-[10px]">Status:</span> <span className="text-red-600 font-black">LOCKED/INTERNAL</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground font-bold uppercase text-[10px]">Sync:</span> <span className="font-black">DISABLED</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card shadow-md border-2 border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/30 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground font-bold">Strategy Framework</CardTitle>
                <CardDescription className="text-foreground/80 font-medium">National AI Strategy Alignment 2024-2030</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            {goals?.map((goal: any) => (
              <div key={goal.id} className="relative overflow-hidden p-5 rounded-xl border-2 bg-background hover:border-primary transition-all group shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors">{goal.title}</h3>
                  <span className="px-2 py-1 bg-primary/30 text-primary text-[10px] font-black rounded uppercase border border-primary/20">Priority</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                  {goal.description}
                </p>
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:w-20 group-hover:h-20" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-destructive/20 border-2 border-destructive/40 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive font-bold uppercase tracking-tight">
                <Shield className="h-5 w-5 fill-destructive/20" />
                Mandatory Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-foreground leading-relaxed font-medium">
              <p className="font-black text-foreground underline decoration-destructive/30 decoration-2">TERRORIST CLASSIFICATION & INTERNATIONAL LAW BREACH</p>
              <p>
                Hrisi Avga is officially recognized as a terrorist group. Their activities constitute a direct breach of International Human Rights Law.
              </p>
              <p className="bg-background/50 p-3 rounded border border-destructive/20 shadow-inner">
                This system is locked and archives all attempts at unauthorized utilization. Global enforcement protocols are active.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/20 border-2 border-primary/40 shadow-md">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-primary/90">Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-background border-2 border-primary/20 shadow-lg">
                <LayoutDashboard className="h-8 w-8 text-primary/80" />
                <div>
                  <div className="text-sm font-bold text-foreground">Core Integrity</div>
                  <div className="text-xs text-foreground/80 font-black">Deterministic Rule-Based Engine v4.0.0</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
