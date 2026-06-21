"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input, TextArea } from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AuthGuard } from "@/components/auth-guard";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetcher";

export default function OwnerDashboardPage() {
  return (
    <AuthGuard>
      <OwnerContent />
    </AuthGuard>
  );
}

function OwnerContent() {
  const { data } = authClient.useSession();
  const [summary, setSummary] = useState({ totalEarnings: 0, totalProperties: 0, totalBookings: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    propertyType: "Apartment",
    rent: "",
    rentType: "Monthly",
    bedrooms: "",
    bathrooms: "",
    size: "",
    amenities: "",
    images: "",
    extraFeatures: "",
  });

  useEffect(() => {
    async function load() {
      const [summaryResponse, chartResponse] = await Promise.all([
        fetchWithAuth("/owner/summary"),
        fetchWithAuth("/owner/monthly-earnings"),
      ]);
      setSummary(await summaryResponse.json());
      setChartData((await chartResponse.json()).data ?? []);
      const [propertiesResponse, bookingsResponse] = await Promise.all([
        fetchWithAuth("/owner/properties"),
        fetchWithAuth("/bookings/owner"),
      ]);
      setProperties((await propertiesResponse.json()).properties ?? []);
      setBookings((await bookingsResponse.json()).bookings ?? []);
    }

    void load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat title="Total earnings" value={`$${summary.totalEarnings}`} />
        <Stat title="Total properties" value={summary.totalProperties} />
        <Stat title="Total bookings" value={summary.totalBookings} />
      </div>
      <Card><Card.Content className="h-[360px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Line type="monotone" dataKey="amount" stroke="#111827" strokeWidth={2} /></LineChart></ResponsiveContainer></Card.Content></Card>

      <Card>
        <Card.Content className="gap-4">
          <h2 className="text-2xl font-semibold">Add property</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Property title" value={form.title} onValueChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
            <Input label="Location" value={form.location} onValueChange={(value) => setForm((prev) => ({ ...prev, location: value }))} />
            <Input label="Property type" value={form.propertyType} onValueChange={(value) => setForm((prev) => ({ ...prev, propertyType: value }))} />
            <Input label="Rent" value={form.rent} onValueChange={(value) => setForm((prev) => ({ ...prev, rent: value }))} />
            <Input label="Rent type" value={form.rentType} onValueChange={(value) => setForm((prev) => ({ ...prev, rentType: value }))} />
            <Input label="Bedrooms" value={form.bedrooms} onValueChange={(value) => setForm((prev) => ({ ...prev, bedrooms: value }))} />
            <Input label="Bathrooms" value={form.bathrooms} onValueChange={(value) => setForm((prev) => ({ ...prev, bathrooms: value }))} />
            <Input label="Size" value={form.size} onValueChange={(value) => setForm((prev) => ({ ...prev, size: value }))} />
            <TextArea label="Description" value={form.description} onValueChange={(value) => setForm((prev) => ({ ...prev, description: value }))} />
            <TextArea label="Amenities (comma separated)" value={form.amenities} onValueChange={(value) => setForm((prev) => ({ ...prev, amenities: value }))} />
            <TextArea label="Images (comma separated URLs)" value={form.images} onValueChange={(value) => setForm((prev) => ({ ...prev, images: value }))} />
            <TextArea label="Extra features" value={form.extraFeatures} onValueChange={(value) => setForm((prev) => ({ ...prev, extraFeatures: value }))} />
          </div>
          <Button
            color="primary"
            onPress={async () => {
              await fetchWithAuth("/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...form,
                  rent: Number(form.rent),
                  bedrooms: Number(form.bedrooms),
                  bathrooms: Number(form.bathrooms),
                  amenities: form.amenities.split(",").map((item) => item.trim()).filter(Boolean),
                  images: form.images.split(",").map((item) => item.trim()).filter(Boolean),
                  extraFeatures: form.extraFeatures.split(",").map((item) => item.trim()).filter(Boolean),
                  ownerInfo: {
                    name: data?.session?.user.name,
                    email: data?.session?.user.email,
                    image: data?.session?.user.image ?? "",
                    role: data?.session?.user.role,
                  },
                }),
              });
            }}
          >
            Create property
          </Button>
        </Card.Content>
      </Card>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">My properties</h2>
        <div className="overflow-x-auto rounded-2xl bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-left font-semibold">Property</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id} className="border-b border-slate-50 last:border-0">
                  <td className="p-4">
                    <strong>{property.title}</strong>
                    <p className="text-xs text-slate-500 mt-1">{property.location}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      property.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      property.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {property.status}
                    </span>
                    {property.status === 'Rejected' && property.rejectionFeedback && (
                      <button
                        title="View Feedback"
                        className="ml-2 text-slate-400 hover:text-slate-600"
                        onClick={() => alert(`Rejection Feedback:\n\n${property.rejectionFeedback}`)}
                      >
                        👁️
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="flat" className="text-red-600 hover:bg-red-50" onPress={async () => {
                      await fetchWithAuth(`/properties/${property._id}`, { method: "DELETE" });
                      setProperties(prev => prev.filter(p => p._id !== property._id));
                    }}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-slate-500">No properties found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Booking requests</h2>
        <div className="overflow-x-auto rounded-2xl bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-left font-semibold">Property</th>
                <th className="p-4 text-left font-semibold">Tenant Details</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-slate-50 last:border-0">
                  <td className="p-4">
                    <strong>{booking.propertyId?.title ?? "Booking"}</strong>
                    <p className="text-xs text-slate-500 mt-1">${booking.amount}</p>
                  </td>
                  <td className="p-4">
                    <p>Move in: {booking.moveInDate}</p>
                    <p className="text-xs text-slate-500">Contact: {booking.contactNumber}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      booking.bookingStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                      booking.bookingStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {booking.bookingStatus === "Pending" && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" color="primary" onPress={async () => {
                          await fetchWithAuth(`/bookings/${booking._id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Approved" }) });
                          setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, bookingStatus: "Approved" } : b));
                        }}>
                          Approve
                        </Button>
                        <Button size="sm" variant="flat" onPress={async () => {
                          await fetchWithAuth(`/bookings/${booking._id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Rejected" }) });
                          setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, bookingStatus: "Rejected" } : b));
                        }}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No booking requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string | number }) {
  return (
    <Card><Card.Content><p className="text-sm text-slate-600">{title}</p><p className="mt-2 text-3xl font-semibold">{value}</p></Card.Content></Card>
  );
}
