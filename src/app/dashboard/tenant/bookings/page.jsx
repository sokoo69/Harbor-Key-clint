"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetcher";
import { authClient } from "@/lib/auth-client";

export default function TenantBookingsPage() {
  const { data } = authClient.useSession();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetchWithAuth("/bookings/mine");
      const json = await res.json();
      setBookings(json.bookings ?? []);
    }
    void load();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-arch/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">My Bookings</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-arch mt-1">Rental Records</p>
      </div>

      <div className="overflow-x-auto bg-white border border-arch/20 shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-plaster border-b border-arch/20">
            <tr>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink">User Name</th>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink">Email</th>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink">Price</th>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink">Payment Status</th>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink">Booking Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center font-mono text-sm text-arch">
                  NO RECORDS FOUND
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-arch/10 last:border-0 hover:bg-plaster/50 transition-colors">
                  <td className="p-4 font-bold text-ink">{data?.user?.name ?? "Tenant"}</td>
                  <td className="p-4 text-arch">{data?.user?.email ?? "-"}</td>
                  <td className="p-4 font-mono font-bold text-ink">${booking.amount}</td>
                  <td className="p-4 font-mono text-xs font-bold uppercase text-blueprint">{booking.paymentStatus || "PAID"}</td>
                  <td className={`p-4 font-mono text-xs font-bold uppercase ${booking.bookingStatus === "Rejected" || booking.bookingStatus === "Cancelled" ? "text-red-500" : "text-highlight bg-ink inline-block px-2 py-1 mt-3 mb-3 ml-4"}`}>
                    {booking.bookingStatus || "Pending"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
