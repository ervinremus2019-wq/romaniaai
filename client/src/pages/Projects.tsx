import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProjects, useCreateProject } from "@/hooks/use-projects";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Search, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema } from "@shared/schema";
import type { InsertProject } from "@shared/schema";

export default function Projects() {
  const [sectorFilter, setSectorFilter] = useState<string | undefined>();
  const { data: projects, isLoading } = useProjects(sectorFilter);
  const { mutate: createProject, isPending } = useCreateProject();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      sector: "Public Administration",
      status: "proposed",
      isPublic: true
    }
  });

  const onSubmit = (data: InsertProject) => {
    createProject({ ...data, ownerId: user?.id }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container-page">
        <PageHeader 
          title="Projects Registry" 
          description="A centralized database of AI initiatives across Romanian public and private sectors."
          action={
            user && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Submit New Project</DialogTitle>
                    <DialogDescription>
                      Share your AI initiative with the national ecosystem.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input id="title" {...form.register("title")} placeholder="e.g. AI for Traffic Management" />
                      {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sector">Sector</Label>
                      <Select onValueChange={(val) => form.setValue("sector", val)} defaultValue={form.getValues("sector")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Public Administration">Public Administration</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Justice">Justice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        {...form.register("description")} 
                        placeholder="Describe the project goals and technologies used..."
                        className="h-32" 
                      />
                      {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
                        {isPending ? "Submitting..." : "Submit Project"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )
          }
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-10" />
          </div>
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="All Sectors" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Public Administration">Public Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {project.sector}
                    </span>
                    <span className={`
                      text-xs font-bold px-2 py-0.5 rounded-full capitalize
                      ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}
                    `}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-primary group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {project.description}
                  </p>
                  <div className="pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                    <span>Added {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
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
