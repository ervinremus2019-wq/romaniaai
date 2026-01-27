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
      toast({ title: "Simulation Complete", description: `Risk Level: ${data.riskLevel}` });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Simulation Failed", description: "Please try again later." });
    }
  });

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Compliance Simulator</h1>
        <p className="text-muted-foreground">
          Analyze your AI project against EU AI Act prohibited practices.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the AI system's core functionality..." {...field} />
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
                      <FormLabel>Intended Use</FormLabel>
                      <FormControl>
                        <Textarea placeholder="How and where will this be deployed?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
