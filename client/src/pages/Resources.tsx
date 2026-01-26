import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useResources } from "@/hooks/use-strategy";
import { FileText, Download, ExternalLink } from "lucide-react";

export default function Resources() {
  const { data: resources, isLoading } = useResources();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container-page">
        <PageHeader 
          title="Resources Center" 
          description="Guides, regulations, and educational materials to support AI adoption."
        />

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Hardcoded PDF Card (from prompt assets) */}
            <Card className="hover:shadow-lg transition-all border-l-4 border-l-accent">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-1">National AI Strategy</h3>
                  <p className="text-sm text-muted-foreground">Official Document (2024-2027)</p>
                </div>
                <div className="text-xs font-semibold px-2 py-1 rounded bg-muted inline-block mb-4">
                  PDF • 12.5 MB
                </div>
                <a href="https://www.research.gov.ro/uploads/strategia-nationala-ia/strategie-inteligenta-artificiala-22012024-clean-final-1769390135238.pdf" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Dynamic Resources from DB */}
            {resources?.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-all border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    {resource.type === 'guide' ? <FileText className="w-6 h-6 text-primary" /> : <ExternalLink className="w-6 h-6 text-primary" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{resource.category} • {resource.type}</p>
                  </div>
                  {resource.content && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {resource.content}
                    </p>
                  )}
                  {resource.url && (
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View Resource
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
