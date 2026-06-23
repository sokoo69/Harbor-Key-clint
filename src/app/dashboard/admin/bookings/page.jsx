"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetcher";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    async function load() {
      const res = await fetchWithAuth(`/admin/bookings?page=${page}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
        setPages(data.pages);
      }
    }
    void load();
  }, [page]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-arch/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">Booking Ledgers</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-arch mt-1">Platform Transactions</p>
      </div>

      <div className="border border-arch/20 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-plaster border-b border-arch/20">
            <tr>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Property Title</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Tenant ID</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Amount</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Move-in Date</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-arch/10 last:border-0 hover:bg-plaster/50 transition-colors">
                <td className="p-4 font-bold text-ink">{booking.propertyId?.title ?? "Unknown"}</td>
                <td className="p-4 font-mono text-xs text-arch">{booking.tenantId}</td>
                <td className="p-4 font-mono font-bold text-ink">${booking.amount}</td>
                <td className="p-4 font-mono text-ink">{booking.moveInDate}</td>
                <td className="p-4 font-mono text-xs font-bold uppercase tracking-widest">
                  <span className={booking.bookingStatus === 'Approved' ? 'text-blueprint' : booking.bookingStatus === 'Rejected' ? 'text-red-500' : 'text-highlight bg-ink px-2 py-1'}>
                    {booking.bookingStatus}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan={5} className="p-8 text-center font-mono text-sm uppercase tracking-widest text-arch">No ledgers found.</td></tr>}
          </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-arch/20 flex flex-wrap items-center justify-center gap-2">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="flex h-10 w-32 items-center justify-center border border-arch/20 bg-white font-mono text-xs font-bold uppercase tracking-widest text-ink hover:bg-plaster disabled:opacity-50 transition-colors"
          >
            PREV
          </button>
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`flex h-10 w-10 items-center justify-center border font-mono text-sm font-bold transition-colors ${page === i + 1 ? 'border-blueprint bg-blueprint text-white' : 'border-arch/20 bg-white text-ink hover:bg-plaster'}`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            disabled={page === pages} 
            onClick={() => setPage(p => p + 1)}
            className="flex h-10 w-32 items-center justify-center border border-arch/20 bg-white font-mono text-xs font-bold uppercase tracking-widest text-ink hover:bg-plaster disabled:opacity-50 transition-colors"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
