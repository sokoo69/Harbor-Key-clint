"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SiteNavbar() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-arch/20 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-ink flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center bg-blueprint text-white text-lg">H</span>
          Harbor & Key
        </Link>
        <nav className="hidden gap-8 md:flex">
          <Link href="/" className="text-sm font-medium tracking-wide text-ink hover:text-blueprint transition-colors">
            HOME
          </Link>
          <Link href="/properties" className="text-sm font-medium tracking-wide text-ink hover:text-blueprint transition-colors">
            ALL PROPERTIES
          </Link>
          {data?.session && (
            <Link 
              href={(data?.user?.role || "tenant") === "admin" ? "/dashboard/admin" : (data?.user?.role || "tenant") === "owner" ? "/dashboard/owner" : "/dashboard/tenant"} 
              className="text-sm font-medium tracking-wide text-ink hover:text-blueprint transition-colors"
            >
              DASHBOARD
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="h-8 w-20 animate-pulse bg-arch/20"></div>
          ) : !data?.session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold tracking-wide text-ink transition-colors hover:text-blueprint"
              >
                LOGIN
              </Link>
              <Link
                href="/register"
                className="bg-ink px-5 py-2 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-blueprint"
              >
                REGISTER
              </Link>
            </div>
          ) : (
            <button
              onClick={async () => {
                await authClient.signOut();
                router.push("/");
              }}
              className="text-sm font-medium tracking-wide text-ink transition-colors hover:text-blueprint"
            >
              LOGOUT
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
