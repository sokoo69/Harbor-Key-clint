"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetcher";
import { useToast } from "@/components/toast";

export default function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState({});
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    async function load() {
      const res = await fetchWithAuth(`/admin/users?page=${page}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setPages(data.pages);
      }
    }
    void load();
  }, [page]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-arch/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">User Directory</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-arch mt-1">Platform Members</p>
      </div>

      <div className="border border-arch/20 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-plaster border-b border-arch/20">
            <tr>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Name</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Email</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Role Assignment</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const userId = user._id || user.id;
              return (
                <tr key={userId} className="border-b border-arch/10 last:border-0 hover:bg-plaster/50 transition-colors">
                  <td className="p-4 font-bold text-ink">{user.name}</td>
                  <td className="p-4 font-mono text-xs text-arch">{user.email}</td>
                  <td className="p-4">
                    <select
                      className="w-32 border border-arch/20 bg-white px-3 py-2 text-sm font-bold uppercase tracking-widest focus:border-blueprint focus:outline-none appearance-none cursor-pointer"
                      value={role[userId] ?? user.role ?? "tenant"}
                      onChange={(event) => setRole((prev) => ({ ...prev, [userId]: event.target.value }))}
                    >
                      <option value="tenant">TENANT</option>
                      <option value="owner">OWNER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      className="border border-blueprint bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-blueprint hover:bg-blueprint hover:text-white transition-colors"
                      onClick={async () => {
                        const res = await fetchWithAuth(`/admin/users/${userId}/role`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ role: role[userId] ?? "tenant" }),
                        });
                        if (res.ok) {
                          toast("User role updated", "success");
                        } else {
                          toast("Could not update role", "error");
                        }
                      }}
                    >
                      UPDATE ROLE
                    </button>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && <tr><td colSpan={4} className="p-8 text-center font-mono text-sm uppercase tracking-widest text-arch">No users found.</td></tr>}
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
