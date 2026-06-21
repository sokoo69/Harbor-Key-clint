"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@heroui/react";
import { AuthGuard } from "@/components/auth-guard";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetcher";
import { FadeIn } from "@/components/animated";

export default function TenantDashboardPage() {
  return (
    <AuthGuard>
      <FadeIn>
        <TenantContent />
      </FadeIn>
    </AuthGuard>
  );
}

function TenantContent() {
  const { data } = authClient.useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const [bookingResponse, favoriteResponse] = await Promise.all([
        fetchWithAuth("/bookings/mine"),
        fetchWithAuth("/favorites"),
      ]);
      const bookingData = await bookingResponse.json();
      const favoriteData = await favoriteResponse.json();
      setBookings(bookingData.bookings ?? []);
      setFavorites(favoriteData.favorites ?? []);
    }

    void load();
  }, []);

  return (
    <div className="space-y-8">
      <Card><Card.Content><h1 className="text-3xl font-semibold">Tenant dashboard</h1><p className="text-slate-600">Bookings, favorites, and profile access.</p></Card.Content></Card>

      <section>
        <h2 className="mb-4 text-xl font-semibold">My bookings</h2>
        <div className="overflow-x-auto rounded-2xl bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr><th className="p-3 text-left">Property</th><th className="p-3 text-left">Amount</th><th className="p-3 text-left">Booking status</th><th className="p-3 text-left">Payment status</th></tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t">
                  <td className="p-3">{booking.propertyId?.title ?? "Property"}</td>
                  <td className="p-3">${booking.amount}</td>
                  <td className="p-3">{booking.bookingStatus}</td>
                  <td className="p-3">{booking.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Favorites</h2>
        <div className="overflow-x-auto rounded-2xl bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr><th className="p-3 text-left">Property</th><th className="p-3 text-left">Location</th><th className="p-3 text-left">Action</th></tr>
            </thead>
            <tbody>
              {favorites.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">{item.propertyId?.title ?? "Property"}</td>
                  <td className="p-3">{item.propertyId?.location ?? "-"}</td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={async () => {
                        await fetchWithAuth(`/favorites/${item.propertyId?._id}`, { method: "DELETE" });
                      }}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Profile</h2>
        <Card>
          <Card.Content>
            <p className="font-semibold">{itemName(data?.session?.user.name)}</p>
            <p className="text-sm text-slate-600">{data?.session?.user.email}</p>
          </Card.Content>
        </Card>
      </section>
    </div>
  );
}

function itemName(name?: string) {
  return name || "Tenant";
}
