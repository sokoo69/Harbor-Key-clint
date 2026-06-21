"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data } = authClient.useSession();

  return (
    <AuthGuard>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link href="/dashboard" className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white">
            Overview
          </Link>
          <Link href="/dashboard/tenant" className="rounded-full border border-slate-300 px-4 py-2 text-sm">
            Tenant
          </Link>
          <Link href="/dashboard/owner" className="rounded-full border border-slate-300 px-4 py-2 text-sm">
            Owner
          </Link>
          <Link href="/dashboard/admin" className="rounded-full border border-slate-300 px-4 py-2 text-sm">
            Admin
          </Link>
          <span className="ml-auto text-sm text-slate-600">{data?.session?.user.name}</span>
        </div>
        {children}
      </main>
    </AuthGuard>
  );
}
