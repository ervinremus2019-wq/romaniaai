import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertComplianceCheck } from "@shared/schema";

export function useComplianceHistory() {
  return useQuery({
    queryKey: [api.compliance.history.path],
    queryFn: async () => {
      const res = await fetch(api.compliance.history.path);
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.compliance.history.responses[200].parse(await res.json());
    },
  });
}

export function useSimulateCompliance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertComplianceCheck) => {
      const res = await fetch(api.compliance.simulate.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Simulation failed");
      return api.compliance.simulate.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.compliance.history.path] });
    },
    onError: (error) => {
      toast({
        title: "Simulation Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
