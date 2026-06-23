"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetcher";
import { CalendarRange, Heart, Home, User, Settings } from "lucide-react";
import { PageBanner } from "@/components/page-banner";

export default function TenantDashboardPage() {
  const { data } = authClient.useSession();
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function load() {
      const [bookingResponse, favoriteResponse] = await Promise.all([
        fetchWithAuth("/bookings/mine"),
        fetchWithAuth("/favorites"),
      ]);
      const bookingData = await bookingResponse.json();
      const favoriteData = await favoriteResponse.json();
      
      const bookings = bookingData.bookings || [];
      const favorites = favoriteData.favorites || [];

      setTotalBookings(bookings.length);
      setTotalFavorites(favorites.length);

      const dynamicActivities = [
        ...bookings.map((b) => ({
          date: new Date(b.createdAt),
          message: `Booked "${b.propertyId?.title || 'a property'}" in ${b.propertyId?.location || 'unknown'}.`,
        })),
        ...favorites.map((f) => ({
          date: new Date(f.createdAt),
          message: `Added "${f.propertyId?.title || 'a property'}" to favorites.`,
        })),
      ].sort((a, b) => b.date - a.date).slice(0, 5);

      setActivities(dynamicActivities);
    }
    void load();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageBanner 
        title="Tenant Control Panel" 
        subtitle="System Status" 
        icon={Settings} 
      />

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-arch/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arch">
            Total Bookings
            <CalendarRange className="h-4 w-4 text-blueprint" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">{totalBookings}</p>
        </div>
        
        <div className="border border-arch/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arch">
            Favorites
            <Heart className="h-4 w-4 text-blueprint" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">{totalFavorites}</p>
        </div>
        
        <div className="border border-arch/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arch">
            Active Rentals
            <Home className="h-4 w-4 text-blueprint" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">{totalBookings > 0 ? totalBookings : 0}</p>
        </div>
        
        <div className="border border-arch/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arch">
            Profile Status
            <User className="h-4 w-4 text-blueprint" />
          </div>
          <p className="mt-2 text-lg font-bold font-display text-highlight bg-ink inline-block px-2 py-1 uppercase">Completed</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="border border-arch/20 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-bold font-display text-ink border-b border-arch/20 pb-4">Activity Log</h2>
        <div className="mt-6 space-y-4 font-mono text-sm text-arch">
          {activities.length > 0 ? (
            activities.map((act, i) => (
              <p key={i} className="flex items-center gap-4">
                <span className="text-blueprint">SYS</span> {act.message}
              </p>
            ))
          ) : (
            <p className="text-arch/60">No recent activity found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
