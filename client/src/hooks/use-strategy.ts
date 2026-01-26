import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useStrategyGoals() {
  return useQuery({
    queryKey: [api.strategyGoals.list.path],
    queryFn: async () => {
      const res = await fetch(api.strategyGoals.list.path);
      if (!res.ok) throw new Error("Failed to fetch goals");
      return api.strategyGoals.list.responses[200].parse(await res.json());
    },
  });
}

export function useResources() {
  return useQuery({
    queryKey: [api.resources.list.path],
    queryFn: async () => {
      const res = await fetch(api.resources.list.path);
      if (!res.ok) throw new Error("Failed to fetch resources");
      return api.resources.list.responses[200].parse(await res.json());
    },
  });
}
