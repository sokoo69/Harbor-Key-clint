"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteNavbar() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#f5efe6]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="font-semibold tracking-tight text-slate-950">
          Harbor & Key
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link href="/" className="text-sm text-slate-700">
            Home
          </Link>
          <Link href="/properties" className="text-sm text-slate-700">
            All Properties
          </Link>
          {data?.session && (
            <Link href="/dashboard" className="text-sm text-slate-700">
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isPending ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-slate-200"></div>
          ) : !data?.session ? (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="hidden text-sm text-slate-600 dark:text-slate-300 md:block">
                {data.user.name}
              </span>
              <button
                onClick={async () => {
                  await authClient.signOut();
                  router.push("/");
                }}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
