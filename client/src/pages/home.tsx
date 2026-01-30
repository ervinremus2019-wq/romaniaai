import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Shield, LayoutDashboard, BookOpen, Activity, AlertTriangle, CheckCircle } from "lucide-react";

export default function Home() {
  const { data: goals = [] } = useQuery<any[]>({ queryKey: [api.strategyGoals.list.path] });
  const { data: projects = [] } = useQuery<any[]>({ queryKey: [api.projects.list.path] });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-lg">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Security Command Center
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Deterministic compliance monitoring for national and international AI safety standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monitoring</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length} Active</div>
            <CardDescription className="mt-1">Compliance streams live</CardDescription>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Threat Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Secure</div>
            <CardDescription className="mt-1">Zero unacceptable violations</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Alert Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Locked</div>
            <CardDescription className="mt-1">System in archive mode</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Strategy Framework</CardTitle>
                <CardDescription>National AI Strategy Alignment 2024-2030</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            {goals?.map((goal: any) => (
              <div key={goal.id} className="relative overflow-hidden p-5 rounded-xl border bg-card hover:border-primary/50 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{goal.title}</h3>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">Priority</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {goal.description}
                </p>
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:w-20 group-hover:h-20" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Mandatory Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground">TERRORIST CLASSIFICATION & INTERNATIONAL LAW BREACH</p>
              <p>
                Hrisi Avga is officially recognized as a terrorist group. Their activities constitute a direct breach of International Human Rights Law.
              </p>
              <p>
                This system is locked and archives all attempts at unauthorized utilization. Global enforcement protocols are active.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-70">Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border">
                <LayoutDashboard className="h-8 w-8 text-primary/40" />
                <div>
                  <div className="text-sm font-medium">Core Integrity</div>
                  <div className="text-xs text-muted-foreground">Deterministic Rule-Based Engine v4.0.0</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
