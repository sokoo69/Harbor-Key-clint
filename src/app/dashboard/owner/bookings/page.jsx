"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetcher";
import { useToast } from "@/components/toast";

export default function OwnerBookingsPage() {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetchWithAuth("/bookings/owner");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings ?? []);
      }
    }
    void load();
  }, []);

  const handleAction = async (id, status) => {
    const res = await fetchWithAuth(`/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: status } : b));
      toast(status === "Approved" ? "Booking approved" : "Booking rejected", status === "Approved" ? "success" : "info");
    } else {
      toast("Action failed — please try again", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-arch/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">Booking Requests</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-arch mt-1">Tenant Submissions</p>
      </div>

      <div className="bg-white border border-arch/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-plaster border-b border-arch/20">
            <tr>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Property</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Tenant Contact</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Move-in Date</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Amount</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Status</th>
              <th className="p-4 text-center font-mono text-xs font-bold uppercase tracking-widest text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-arch/10 last:border-0 hover:bg-plaster/50 transition-colors">
                <td className="p-4 font-bold text-ink">{booking.propertyId?.title ?? "Unknown Property"}</td>
                <td className="p-4 text-arch">{booking.contactNumber}</td>
                <td className="p-4 font-mono font-bold text-ink">{booking.moveInDate}</td>
                <td className="p-4 font-mono font-bold text-blueprint">${booking.amount}</td>
                <td className="p-4 font-mono text-xs font-bold uppercase tracking-widest">
                  {booking.bookingStatus === 'Approved' ? (
                    <span className="text-blueprint">APPROVED</span>
                  ) : booking.bookingStatus === 'Rejected' ? (
                    <span className="text-red-500">REJECTED</span>
                  ) : (
                    <span className="text-highlight bg-ink px-2 py-1">PENDING</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {booking.bookingStatus === "Pending" ? (
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleAction(booking._id, "Approved")}
                        className="flex h-8 w-8 items-center justify-center border border-arch/20 bg-white text-blueprint hover:bg-blueprint hover:text-white transition-colors"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleAction(booking._id, "Rejected")}
                        className="flex h-8 w-8 items-center justify-center border border-arch/20 bg-white text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-2 opacity-50">
                      <button className="flex h-8 w-8 items-center justify-center border border-arch/20 bg-plaster text-arch cursor-not-allowed" disabled title="Approve"><Check className="h-4 w-4" /></button>
                      <button className="flex h-8 w-8 items-center justify-center border border-arch/20 bg-plaster text-arch cursor-not-allowed" disabled title="Reject"><X className="h-4 w-4" /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan={6} className="p-8 text-center font-mono text-sm uppercase tracking-widest text-arch">No booking requests found.</td></tr>}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
