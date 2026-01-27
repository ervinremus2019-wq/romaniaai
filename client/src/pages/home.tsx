import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Shield, LayoutDashboard, BookOpen, Plus } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: goals = [] } = useQuery<any[]>({ queryKey: [api.strategyGoals.list.path] });
  const { data: projects = [] } = useQuery<any[]>({ queryKey: [api.projects.list.path] });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">AI Compliance Simulator</h1>
        <p className="text-muted-foreground text-lg">
          Ensuring AI project alignment with the EU AI Act and Romanian National Strategy.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-1">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-1">
            <CardTitle className="text-sm font-medium">Compliance Risk</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Minimal</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Strategy Goals</CardTitle>
              <p className="text-sm text-muted-foreground">National objectives for AI development.</p>
            </div>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {goals?.map((goal: any) => (
              <div key={goal.id} className="p-4 border rounded-md hover:bg-accent transition-colors">
                <h3 className="font-semibold">{goal.title}</h3>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start gap-2" variant="default" asChild>
              <Link href="/simulate">
                <Shield className="h-4 w-4" />
                Start Simulation
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/audit">
                <BookOpen className="h-4 w-4" />
                View Audit Trail
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="ghost">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
