"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input, TextArea } from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AuthGuard } from "@/components/auth-guard";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetcher";

export default function OwnerDashboardPage() {
  return (
    <AuthGuard allowedRoles={["owner"]}>
      <OwnerContent />
    </AuthGuard>
  );
}

function OwnerContent() {
  const { data } = authClient.useSession();
  const [summary, setSummary] = useState({ totalEarnings: 0, totalProperties: 0, totalBookings: 0 });
  const [chartData, setChartData] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editForm, setEditForm] = useState(null);
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold">Owner dashboard</h1>
        <Button
          color="primary"
          variant="flat"
          onPress={async () => {
            const element = document.getElementById("report-area");
            if (element) {
              const html2pdf = (await import("html2pdf.js")).default;
              html2pdf().from(element).save("harbor-key-earnings-report.pdf");
            }
          }}
        >
          Download PDF Report
        </Button>
      </div>
      
      <div id="report-area" className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Stat title="Total earnings" value={`$${summary.totalEarnings}`} />
          <Stat title="Total properties" value={summary.totalProperties} />
          <Stat title="Total bookings" value={summary.totalBookings} />
        </div>
        <Card><Card.Content className="h-[360px] p-6"><h3 className="mb-4 text-xl font-semibold">Monthly earnings</h3><ResponsiveContainer width="100%" height="80%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Line type="monotone" dataKey="amount" stroke="#d97706" strokeWidth={2} /></LineChart></ResponsiveContainer></Card.Content></Card>
      </div>

      <Card>
        <Card.Content className="gap-4">
          <h2 className="text-2xl font-semibold">Add property</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Property title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
            <Input label="Location" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} />
            <Input label="Property type" value={form.propertyType} onChange={(e) => setForm((prev) => ({ ...prev, propertyType: e.target.value }))} />
            <Input label="Rent" value={form.rent} onChange={(e) => setForm((prev) => ({ ...prev, rent: e.target.value }))} />
            <Input label="Rent type" value={form.rentType} onChange={(e) => setForm((prev) => ({ ...prev, rentType: e.target.value }))} />
            <Input label="Bedrooms" value={form.bedrooms} onChange={(e) => setForm((prev) => ({ ...prev, bedrooms: e.target.value }))} />
            <Input label="Bathrooms" value={form.bathrooms} onChange={(e) => setForm((prev) => ({ ...prev, bathrooms: e.target.value }))} />
            <Input label="Size" value={form.size} onChange={(e) => setForm((prev) => ({ ...prev, size: e.target.value }))} />
            <TextArea label="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
            <TextArea label="Amenities (comma separated)" value={form.amenities} onChange={(e) => setForm((prev) => ({ ...prev, amenities: e.target.value }))} />
            <TextArea label="Images (comma separated URLs)" value={form.images} onChange={(e) => setForm((prev) => ({ ...prev, images: e.target.value }))} />
            <TextArea label="Extra features" value={form.extraFeatures} onChange={(e) => setForm((prev) => ({ ...prev, extraFeatures: e.target.value }))} />
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
                    name: data?.user?.name,
                    email: data?.user?.email,
                    image: data?.user?.image ?? "",
                    role: data?.user?.role,
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
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="flat" onPress={() => {
                        setEditingPropertyId(property._id);
                        setEditForm({
                          title: property.title,
                          description: property.description,
                          location: property.location,
                          propertyType: property.propertyType,
                          rent: String(property.rent),
                          rentType: property.rentType,
                          bedrooms: String(property.bedrooms),
                          bathrooms: String(property.bathrooms),
                          size: property.size,
                          amenities: property.amenities.join(", "),
                          images: property.images.join(", "),
                          extraFeatures: property.extraFeatures.join(", "),
                        });
                      }}>
                        Edit
                      </Button>
                      <Button size="sm" variant="flat" className="text-red-600 hover:bg-red-50" onPress={async () => {
                        await fetchWithAuth(`/properties/${property._id}`, { method: "DELETE" });
                        setProperties(prev => prev.filter(p => p._id !== property._id));
                      }}>
                        Delete
                      </Button>
                    </div>
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

      {editingPropertyId && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl my-8">
            <h3 className="text-xl font-semibold text-slate-950">Edit property</h3>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Input label="Property title" value={editForm.title} onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))} />
              <Input label="Location" value={editForm.location} onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))} />
              <Input label="Property type" value={editForm.propertyType} onChange={(e) => setEditForm((prev) => ({ ...prev, propertyType: e.target.value }))} />
              <Input label="Rent" value={editForm.rent} onChange={(e) => setEditForm((prev) => ({ ...prev, rent: e.target.value }))} />
              <Input label="Rent type" value={editForm.rentType} onChange={(e) => setEditForm((prev) => ({ ...prev, rentType: e.target.value }))} />
              <Input label="Bedrooms" value={editForm.bedrooms} onChange={(e) => setEditForm((prev) => ({ ...prev, bedrooms: e.target.value }))} />
              <Input label="Bathrooms" value={editForm.bathrooms} onChange={(e) => setEditForm((prev) => ({ ...prev, bathrooms: e.target.value }))} />
              <Input label="Size" value={editForm.size} onChange={(e) => setEditForm((prev) => ({ ...prev, size: e.target.value }))} />
              <TextArea label="Description" value={editForm.description} onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))} />
              <TextArea label="Amenities (comma separated)" value={editForm.amenities} onChange={(e) => setEditForm((prev) => ({ ...prev, amenities: e.target.value }))} />
              <TextArea label="Images (comma separated URLs)" value={editForm.images} onChange={(e) => setEditForm((prev) => ({ ...prev, images: e.target.value }))} />
              <TextArea label="Extra features" value={editForm.extraFeatures} onChange={(e) => setEditForm((prev) => ({ ...prev, extraFeatures: e.target.value }))} />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="flat" onPress={() => setEditingPropertyId(null)}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  const response = await fetchWithAuth(`/properties/${editingPropertyId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...editForm,
                      rent: Number(editForm.rent),
                      bedrooms: Number(editForm.bedrooms),
                      bathrooms: Number(editForm.bathrooms),
                      amenities: editForm.amenities.split(",").map((item) => item.trim()).filter(Boolean),
                      images: editForm.images.split(",").map((item) => item.trim()).filter(Boolean),
                      extraFeatures: editForm.extraFeatures.split(",").map((item) => item.trim()).filter(Boolean),
                    }),
                  });
                  const { property } = await response.json();
                  setProperties(prev => prev.map(p => p._id === property._id ? property : p));
                  setEditingPropertyId(null);
                }}
              >
                Save changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <Card><Card.Content><p className="text-sm text-slate-600">{title}</p><p className="mt-2 text-3xl font-semibold">{value}</p></Card.Content></Card>
  );
}
