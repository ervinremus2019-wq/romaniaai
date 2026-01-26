import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSimulateCompliance, useComplianceHistory } from "@/hooks/use-compliance";
import { useAuth } from "@/hooks/use-auth";
import { AlertTriangle, CheckCircle, ShieldAlert, ShieldX, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertComplianceCheckSchema } from "@shared/schema";
import type { InsertComplianceCheck, ComplianceCheckResponse } from "@shared/schema";

export default function Compliance() {
  const { user } = useAuth();
  const { mutate: simulate, isPending } = useSimulateCompliance();
  const { data: history } = useComplianceHistory();
  const [result, setResult] = useState<ComplianceCheckResponse | null>(null);

  const form = useForm<InsertComplianceCheck>({
    resolver: zodResolver(insertComplianceCheckSchema),
    defaultValues: {
      projectDescription: "",
      intendedUse: "",
      userId: user?.id
    }
  });

  const onSubmit = (data: InsertComplianceCheck) => {
    simulate({ ...data, userId: user?.id }, {
      onSuccess: (data) => setResult(data)
    });
  };

  const getRiskColor = (level?: string | null) => {
    switch (level) {
      case 'minimal': return 'bg-green-100 text-green-800 border-green-200';
      case 'limited': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'unacceptable': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (level?: string | null) => {
    switch (level) {
      case 'minimal': return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'limited': return <AlertTriangle className="w-12 h-12 text-yellow-600" />;
      case 'high': return <ShieldAlert className="w-12 h-12 text-orange-600" />;
      case 'unacceptable': return <ShieldX className="w-12 h-12 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container-page">
        <PageHeader 
          title="Compliance Simulator" 
          description="Test your AI use cases against the EU AI Act and National Regulations using our advanced simulator."
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Simulation Form */}
          <div className="space-y-8">
            <Card className="border-t-4 border-t-primary shadow-lg">
              <CardHeader>
                <CardTitle>Run New Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectDescription">Project Description</Label>
                    <Textarea 
                      id="projectDescription" 
                      {...form.register("projectDescription")}
                      placeholder="Describe the technical aspects of your AI system..."
                      className="min-h-[120px]"
                    />
                    {form.formState.errors.projectDescription && (
                      <p className="text-sm text-destructive">{form.formState.errors.projectDescription.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intendedUse">Intended Use Case</Label>
                    <Textarea 
                      id="intendedUse" 
                      {...form.register("intendedUse")}
                      placeholder="Who will use it? For what purpose? In what context?"
                      className="min-h-[100px]"
                    />
                    {form.formState.errors.intendedUse && (
                      <p className="text-sm text-destructive">{form.formState.errors.intendedUse.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full h-12 text-lg bg-primary hover:bg-primary/90">
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Risk...
                      </>
                    ) : (
                      "Simulate Compliance Check"
                    )}
                  </Button>
                  
                  {!user && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      * Log in to save your simulation history.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>

            {user && history && history.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Your Recent Simulations</h3>
                <div className="space-y-4">
                  {history.map((check) => (
                    <div key={check.id} className="p-4 bg-white rounded-lg border border-border shadow-sm flex justify-between items-center">
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{check.projectDescription}</p>
                        <p className="text-xs text-muted-foreground">{new Date(check.createdAt!).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded capitalize ${getRiskColor(check.riskLevel)}`}>
                        {check.riskLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Display */}
          <div className="relative">
            {result ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="h-full border-2 border-primary/10 shadow-xl overflow-hidden">
                  <div className={`p-6 border-b flex items-center gap-4 ${getRiskColor(result.riskLevel)} bg-opacity-10`}>
                    {getRiskIcon(result.riskLevel)}
                    <div>
                      <h2 className="text-2xl font-bold capitalize">{result.riskLevel} Risk</h2>
                      <p className="text-sm opacity-90">Based on EU AI Act Classification</p>
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Analysis Feedback</h3>
                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        {result.feedback?.split('\n').map((line, i) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                        <li>Consult with a legal expert for formal verification.</li>
                        <li>Review the specific articles of the AI Act mentioned above.</li>
                        {result.riskLevel === 'high' && (
                          <li className="text-orange-600 font-medium">Mandatory conformity assessment required.</li>
                        )}
                        {result.riskLevel === 'unacceptable' && (
                          <li className="text-red-600 font-bold">This use case is prohibited in the EU.</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/30">
                <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-medium text-muted-foreground">Ready to Simulate</h3>
                <p className="text-muted-foreground/80 max-w-xs mt-2">
                  Fill out the form to receive an instant AI-powered compliance analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
