import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Simulate() {
  const { toast } = useToast();
  const [result, setResult] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(api.compliance.simulate.input),
    defaultValues: {
      projectDescription: "",
      intendedUse: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", api.compliance.simulate.path, data);
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: [api.compliance.history.path] });
      toast({ 
        title: "Real Analysis Complete", 
        description: `Verified Risk Level: ${data.riskLevel}. Report generated in Audit Trail.` 
      });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Simulation Failed", description: "Please try again later." });
    }
  });

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <header className="space-y-2 border-l-4 border-primary pl-6 py-4 bg-primary/10 rounded-r-lg">
        <h1 className="text-3xl font-extrabold tracking-tight">Real Compliance Simulator</h1>
        <p className="text-foreground/80 font-medium">
          Analyze your AI project against EU AI Act prohibited practices using professional deterministic v8.0 rules.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl font-bold">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-sm uppercase tracking-wider">Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[120px] bg-background border-2 focus:border-primary transition-all"
                          placeholder="Describe the AI system's core functionality, architecture, and data sources..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intendedUse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-sm uppercase tracking-wider">Intended Use</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[120px] bg-background border-2 focus:border-primary transition-all"
                          placeholder="How and where will this be deployed? Specify target users and environments..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-12 text-lg font-black uppercase tracking-widest hover-elevate active-elevate-2 transition-all" disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Run Analysis
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {result ? (
            <Card className={result.riskLevel === "Unacceptable" ? "border-destructive bg-destructive/5" : "border-primary bg-primary/5"}>
              <CardHeader className="flex flex-row items-center gap-2">
                <ShieldAlert className={result.riskLevel === "Unacceptable" ? "text-destructive" : "text-primary"} />
                <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Risk Level</div>
                  <div className={`text-2xl font-bold ${result.riskLevel === "Unacceptable" ? "text-destructive" : "text-primary"}`}>
                    {result.riskLevel}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Feedback</div>
                  <p className="text-sm leading-relaxed">{result.feedback}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed flex items-center justify-center min-h-[300px] text-center p-6">
              <div className="space-y-2">
                <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                <p className="text-sm text-muted-foreground">
                  Run a simulation to see compliance analysis.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
