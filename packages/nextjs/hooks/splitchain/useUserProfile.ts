import { useQuery } from "@tanstack/react-query";

interface User {
  address: string;
  displayName: string;
  avatarUrl?: string | null;
}

export const useUserProfile = (address?: string) => {
  return useQuery({
    queryKey: ["user", address?.toLowerCase()],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`/api/users?address=${address}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch user");
      }
      return (await res.json()) as User;
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
