"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { Home, LayoutDashboard, CalendarRange, Heart, User } from "lucide-react";

export default function TenantDashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <AuthGuard allowedRoles={["tenant"]}>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-drafting">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 bg-ink text-white border-b md:border-b-0 md:border-r border-arch/20">
          <div className="p-4 md:p-6">
            <Link href="/" className="flex items-center gap-3 font-display text-lg font-bold tracking-tight text-white mb-4 md:mb-10 hover:text-blueprint transition-colors">
              <span className="flex h-6 w-6 items-center justify-center bg-blueprint text-xs">H</span>
              Back To Home
            </Link>
            <nav className="flex md:flex-col overflow-x-auto gap-2 pb-2 md:pb-0 no-scrollbar">
              <Link 
                href="/dashboard/tenant" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap flex-shrink-0 ${pathname === "/dashboard/tenant" ? "bg-blueprint text-white border-l-4 border-white" : "text-arch hover:bg-white/5 hover:text-white"}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </Link>
              <Link 
                href="/dashboard/tenant/bookings" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap flex-shrink-0 ${pathname === "/dashboard/tenant/bookings" ? "bg-blueprint text-white border-l-4 border-white" : "text-arch hover:bg-white/5 hover:text-white"}`}
              >
                <CalendarRange className="h-4 w-4" />
                Bookings
              </Link>
              <Link 
                href="/dashboard/tenant/favorites" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap flex-shrink-0 ${pathname === "/dashboard/tenant/favorites" ? "bg-blueprint text-white border-l-4 border-white" : "text-arch hover:bg-white/5 hover:text-white"}`}
              >
                <Heart className="h-4 w-4" />
                Favorites
              </Link>
              <Link 
                href="/dashboard/tenant/profile" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap flex-shrink-0 ${pathname === "/dashboard/tenant/profile" ? "bg-blueprint text-white border-l-4 border-white" : "text-arch hover:bg-white/5 hover:text-white"}`}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden p-4 lg:p-12">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
