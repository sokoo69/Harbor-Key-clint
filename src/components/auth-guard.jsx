"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AuthGuard({ children, allowedRoles }) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!data?.session) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(data.user.role)) {
        router.replace(`/dashboard/${data.user.role}`);
      }
    }
  }, [data, isPending, router, allowedRoles]);

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm font-medium text-slate-500">Checking your session...</div>
      </div>
    );
  }

  if (!data?.session) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(data.user.role)) {
    return null;
  }

  return <>{children}</>;
}
