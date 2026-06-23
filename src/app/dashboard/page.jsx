"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && data?.session) {
      const role = data.user.role ?? "tenant";
      if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "owner") {
        router.replace("/dashboard/owner");
      } else {
        router.replace("/dashboard/tenant");
      }
    }
  }, [data, isPending, router]);

  return (
    <AuthGuard>
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-700 border-r-transparent"></div>
      </div>
    </AuthGuard>
  );
}
