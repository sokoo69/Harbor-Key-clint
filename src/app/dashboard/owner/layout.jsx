"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, PlusCircle, Building2, CalendarRange, User } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";

const navItems = [
  { href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/owner/add-property", label: "Add Property", icon: PlusCircle },
  { href: "/dashboard/owner/my-properties", label: "My Properties", icon: Building2 },
  { href: "/dashboard/owner/bookings", label: "Bookings", icon: CalendarRange },
  { href: "/dashboard/owner/profile", label: "Profile", icon: User },
];

export default function OwnerDashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <AuthGuard allowedRoles={["owner"]}>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-drafting">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 bg-ink text-white border-b md:border-b-0 md:border-r border-arch/20">
          <div className="p-4 md:p-6">
            <Link href="/" className="flex items-center gap-3 font-display text-lg font-bold tracking-tight text-white mb-4 md:mb-10 hover:text-blueprint transition-colors">
              <span className="flex h-6 w-6 items-center justify-center bg-blueprint text-xs">H</span>
              Back To Home
            </Link>
            
            <nav className="flex md:flex-col overflow-x-auto gap-2 pb-2 md:pb-0 no-scrollbar">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap flex-shrink-0 ${
                      isActive 
                        ? "bg-blueprint text-white border-l-4 border-white" 
                        : "text-arch hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
