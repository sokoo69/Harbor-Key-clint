"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { fetchWithAuth } from "@/lib/fetcher";
import { Button, Card, Input, TextArea } from "@heroui/react";

export default function AdminDashboardPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminContent />
    </AuthGuard>
  );
}

function AdminContent() {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [role, setRole] = useState({});
  const [feedback, setFeedback] = useState({});
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    async function load() {
      const [usersResponse, propertiesResponse] = await Promise.all([
        fetchWithAuth("/admin/users"),
        fetchWithAuth("/admin/properties"),
      ]);
      setUsers((await usersResponse.json()).users ?? []);
      setProperties((await propertiesResponse.json()).properties ?? []);
      const [bookingsResponse, transactionsResponse] = await Promise.all([
        fetchWithAuth("/admin/bookings"),
        fetchWithAuth("/admin/transactions"),
      ]);
      setBookings((await bookingsResponse.json()).bookings ?? []);
      setTransactions((await transactionsResponse.json()).transactions ?? []);
    }

    void load();
  }, []);

  return (
    <div className="space-y-8">
      <Card><Card.Content><h1 className="text-3xl font-semibold">Admin dashboard</h1></Card.Content></Card>
      
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">All users</h2>
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-left font-semibold">User</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Role</th>
                <th className="p-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-slate-500">{user.email}</td>
                  <td className="p-4">
                    <select
                      className="rounded-lg border border-slate-200 px-3 py-1.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                      value={role[user.id] ?? user.role ?? "tenant"}
                      onChange={(event) => setRole((prev) => ({ ...prev, [user.id]: event.target.value }))}
                    >
                      <option value="tenant">Tenant</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <Button size="sm" color="primary" onPress={async () => {
                      await fetchWithAuth(`/admin/users/${user.id}/role`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ role: role[user.id] ?? "tenant" }),
                      });
                      alert("Role updated successfully.");
                    }}>
                      Save role
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">All properties</h2>
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-left font-semibold">Property</th>
                <th className="p-4 text-left font-semibold">Location</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="p-4 font-medium">{property.title}</td>
                  <td className="p-4 text-slate-500">{property.location}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      property.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      property.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" color="primary" onPress={async () => {
                        await fetchWithAuth(`/admin/properties/${property._id}/moderate`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "Approved" }),
                        });
                        setProperties(prev => prev.map(p => p._id === property._id ? { ...p, status: "Approved" } : p));
                      }}>
                        Approve
                      </Button>
                      <Button size="sm" variant="flat" onPress={async () => {
                        const reason = window.prompt("Please enter rejection feedback for the owner:");
                        if (reason !== null) {
                          await fetchWithAuth(`/admin/properties/${property._id}/moderate`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: "Rejected", rejectionFeedback: reason || "Needs changes" }),
                          });
                          setProperties(prev => prev.map(p => p._id === property._id ? { ...p, status: "Rejected", rejectionFeedback: reason } : p));
                        }
                      }}>
                        Reject
                      </Button>
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
                        if (window.confirm("Are you sure you want to delete this property?")) {
                          await fetchWithAuth(`/properties/${property._id}`, { method: "DELETE" });
                          setProperties(prev => prev.filter(p => p._id !== property._id));
                        }
                      }}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">No properties found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">All bookings</h2>
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-left font-semibold">Property</th>
                <th className="p-4 text-left font-semibold">Tenant ID</th>
                <th className="p-4 text-left font-semibold">Amount</th>
                <th className="p-4 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="p-4 font-medium">{booking.propertyId?.title ?? "Unknown Property"}</td>
                  <td className="p-4 text-slate-500 text-xs">{booking.tenantId}</td>
                  <td className="p-4">${booking.amount}</td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-800">
                      {booking.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">No bookings found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-left font-semibold">Transaction ID</th>
                <th className="p-4 text-left font-semibold">Property</th>
                <th className="p-4 text-left font-semibold">Amount</th>
                <th className="p-4 text-right font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="p-4 text-xs font-mono">{transaction.transactionId}</td>
                  <td className="p-4 text-slate-500">{transaction.propertyId?.title ?? "Unknown"}</td>
                  <td className="p-4 font-medium">${transaction.amount}</td>
                  <td className="p-4 text-right text-slate-500">{new Date(transaction.date).toLocaleDateString()}</td>
                </tr>
              ))}
              {transactions.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">No transactions found.</td></tr>}
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
