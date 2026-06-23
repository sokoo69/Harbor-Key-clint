"use client";

import { useEffect, useState } from "react";
import { Users, Building2, CalendarRange, UserCheck, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchWithAuth } from "@/lib/fetcher";
import { PageBanner } from "@/components/page-banner";

export default function AdminOverviewPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetchWithAuth("/admin/summary");
      if (res.ok) {
        setSummary(await res.json());
      }
    }
    void load();
  }, []);

  if (!summary) return <div className="p-8 text-center font-mono text-sm uppercase tracking-widest text-arch">Loading overview...</div>;

  const stats = [
    { label: "Total Users", value: summary.totalUsers, icon: Users },
    { label: "Total Owners", value: summary.totalOwners, icon: Building2 },
    { label: "Total Properties", value: summary.totalProperties, icon: UserCheck },
    { label: "Total Bookings", value: summary.totalBookings, icon: CalendarRange },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <PageBanner 
        title="Global Command Center" 
        subtitle="System Administrator" 
        icon={ShieldAlert} 
      />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="border border-arch/20 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-arch">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-ink">{stat.value}</p>
                </div>
                <div className="border border-arch/20 bg-plaster p-4 text-blueprint">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="border border-arch/20 bg-white p-8 shadow-sm">
        <h3 className="mb-8 font-display text-xl font-bold text-ink border-b border-arch/20 pb-4">Platform Revenue Analysis</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.chartData}>
              <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#94A3B8" opacity={0.3} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'monospace' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'monospace' }} dx={-10} />
              <Tooltip 
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{ borderRadius: '0', border: '1px solid #94A3B8', backgroundColor: '#ffffff', fontFamily: 'monospace', fontSize: '12px' }} 
              />
              <Bar dataKey="amount" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
