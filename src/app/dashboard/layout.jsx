"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }) {
  const { data } = authClient.useSession();

  const pathname = usePathname();

  return (
    <AuthGuard>
      <main className={pathname.startsWith("/dashboard/admin") || pathname.startsWith("/dashboard/owner") || pathname.startsWith("/dashboard/tenant") ? "" : "mx-auto max-w-7xl px-6 py-10 lg:px-10"}>
        {!pathname.startsWith("/dashboard/admin") && !pathname.startsWith("/dashboard/owner") && !pathname.startsWith("/dashboard/tenant") && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Link href="/dashboard" className={`rounded-full px-4 py-2 text-sm ${pathname === "/dashboard" ? "bg-slate-950 text-white" : "border border-slate-300"}`}>
              Overview
            </Link>
            <Link href="/dashboard/tenant" className={`rounded-full px-4 py-2 text-sm ${pathname === "/dashboard/tenant" ? "bg-slate-950 text-white" : "border border-slate-300"}`}>
              Tenant
            </Link>
            <Link href="/dashboard/owner" className={`rounded-full px-4 py-2 text-sm ${pathname === "/dashboard/owner" ? "bg-slate-950 text-white" : "border border-slate-300"}`}>
              Owner
            </Link>
            <Link href="/dashboard/admin" className={`rounded-full px-4 py-2 text-sm ${pathname === "/dashboard/admin" ? "bg-slate-950 text-white" : "border border-slate-300"}`}>
              Admin
            </Link>
            <span className="ml-auto text-sm text-slate-600">{data?.user?.name}</span>
          </div>
        )}
        {children}
      </main>
    </AuthGuard>
  );
}
