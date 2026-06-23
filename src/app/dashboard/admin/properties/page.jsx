"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetcher";
import { useToast } from "@/components/toast";

export default function AdminPropertiesPage() {
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectTitle, setRejectTitle] = useState("");
  const [rejectFeedback, setRejectFeedback] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetchWithAuth(`/admin/properties?page=${page}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties);
        setPages(data.pages);
      }
    }
    void load();
  }, [page]);

  const handleApprove = async (id) => {
    const res = await fetchWithAuth(`/admin/properties/${id}/moderate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),
    });
    if (res.ok) {
      setProperties((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "Approved" } : p))
      );
      toast("Property approved", "success");
    } else {
      toast("Could not approve property", "error");
    }
  };

  const submitRejection = async () => {
    if (!rejectFeedback.trim()) {
      toast("Rejection feedback is required", "error");
      return;
    }
    const res = await fetchWithAuth(`/admin/properties/${rejectingId}/moderate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Rejected", rejectionFeedback: rejectFeedback }),
    });
    if (res.ok) {
      setProperties((prev) =>
        prev.map((p) => (p._id === rejectingId ? { ...p, status: "Rejected", rejectionFeedback: rejectFeedback } : p))
      );
      setRejectingId(null);
      setRejectTitle("");
      setRejectFeedback("");
      toast("Property rejected with feedback", "info");
    } else {
      toast("Could not submit rejection", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-arch/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">Property Moderation</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-arch mt-1">Review & Verify Submissions</p>
      </div>

      <div className="border border-arch/20 bg-white shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-plaster border-b border-arch/20">
            <tr>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Title</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Location</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Price</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Type</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Owner Email</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Status</th>
              <th className="p-4 text-center font-mono text-xs font-bold uppercase tracking-widest text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property._id} className="border-b border-arch/10 last:border-0 hover:bg-plaster/50 transition-colors">
                <td className="p-4 font-bold text-ink">{property.title}</td>
                <td className="p-4 text-arch">{property.location}</td>
                <td className="p-4 font-mono font-bold text-ink">${property.rent}</td>
                <td className="p-4 text-arch">{property.propertyType}</td>
                <td className="p-4 font-mono text-xs text-arch">{property.ownerInfo?.email ?? "N/A"}</td>
                <td className="p-4 font-mono text-xs font-bold uppercase tracking-widest">
                  {property.status === 'Approved' ? (
                    <span className="text-blueprint">APPROVED</span>
                  ) : property.status === 'Rejected' ? (
                    <span className="text-red-500">REJECTED</span>
                  ) : (
                    <span className="text-highlight bg-ink px-2 py-1">PENDING</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => handleApprove(property._id)}
                      className="flex h-8 w-8 items-center justify-center border border-arch/20 bg-white text-blueprint hover:bg-blueprint hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Approve Specification"
                      disabled={property.status === "Approved"}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setRejectingId(property._id)}
                      className="flex h-8 w-8 items-center justify-center border border-arch/20 bg-white text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Reject Specification"
                      disabled={property.status === "Rejected"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && <tr><td colSpan={7} className="p-8 text-center font-mono text-sm uppercase tracking-widest text-arch">No properties found.</td></tr>}
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

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
          <div className="w-full max-w-lg border border-arch/20 bg-white p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="mb-8 border-b border-arch/20 pb-4">
              <h3 className="font-display text-2xl font-bold text-ink">Reject Specification</h3>
              <p className="font-mono text-xs uppercase tracking-widest text-arch mt-1">Provide Reason</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Rejection Title</label>
                <input 
                  value={rejectTitle}
                  onChange={(e) => setRejectTitle(e.target.value)}
                  placeholder="E.g. Incomplete Data" 
                  className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Detailed Feedback</label>
                <textarea 
                  value={rejectFeedback}
                  onChange={(e) => setRejectFeedback(e.target.value)}
                  placeholder="Explain why this property specification was rejected..." 
                  rows={4} 
                  className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" 
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-arch/20 pt-6">
              <button 
                onClick={() => { setRejectingId(null); setRejectTitle(""); setRejectFeedback(""); }} 
                className="border border-arch/20 bg-white px-6 py-3 text-sm font-bold tracking-widest text-ink hover:bg-plaster transition-colors"
              >
                CANCEL
              </button>
              <button 
                onClick={submitRejection} 
                className="bg-red-500 px-6 py-3 text-sm font-bold tracking-widest text-white hover:bg-red-600 transition-colors"
              >
                CONFIRM REJECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
