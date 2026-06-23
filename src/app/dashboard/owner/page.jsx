"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchWithAuth } from "@/lib/fetcher";
import { PageBanner } from "@/components/page-banner";
import { Briefcase } from "lucide-react";

export default function OwnerOverviewPage() {
  const [summary, setSummary] = useState({ totalEarnings: 0, totalProperties: 0, totalBookings: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function load() {
      const [summaryResponse, chartResponse] = await Promise.all([
        fetchWithAuth("/owner/summary"),
        fetchWithAuth("/owner/monthly-earnings"),
      ]);
      if (summaryResponse.ok) setSummary(await summaryResponse.json());
      if (chartResponse.ok) setChartData((await chartResponse.json()).data ?? []);
    }
    void load();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageBanner 
        title="Owner Control Panel" 
        subtitle="Metrics Overview" 
        icon={Briefcase} 
      />
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="border border-arch/20 bg-white p-6 shadow-sm">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-arch">Total Earnings</p>
          <p className="mt-2 text-3xl font-bold text-ink">${summary.totalEarnings}</p>
        </div>
        <div className="border border-arch/20 bg-white p-6 shadow-sm">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-arch">Total Properties</p>
          <p className="mt-2 text-3xl font-bold text-ink">{summary.totalProperties}</p>
        </div>
        <div className="border border-arch/20 bg-white p-6 shadow-sm">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-arch">Total Bookings</p>
          <p className="mt-2 text-3xl font-bold text-ink">{summary.totalBookings}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="border border-arch/20 bg-white p-8 shadow-sm">
        <h3 className="mb-8 font-display text-xl font-bold text-ink border-b border-arch/20 pb-4">Monthly Financial Yield</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
