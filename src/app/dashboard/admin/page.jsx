"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { fetchWithAuth } from "@/lib/fetcher";
import { Button, Card, Input } from "@heroui/react";

export default function AdminDashboardPage() {
  return (
    <AuthGuard>
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
    </div>
  );
}
