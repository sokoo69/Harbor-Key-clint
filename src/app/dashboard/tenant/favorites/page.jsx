"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetcher";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/toast";

export default function TenantFavoritesPage() {
  const toast = useToast();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetchWithAuth("/favorites");
      const json = await res.json();
      setFavorites(json.favorites ?? []);
    }
    void load();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-arch/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">Saved Properties</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-arch mt-1">Bookmarked Specs</p>
      </div>

      <div className="overflow-x-auto bg-white border border-arch/20 shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-plaster border-b border-arch/20">
            <tr>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink">Title</th>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink">Type</th>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink">Location</th>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink">Price</th>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink">Bathrooms</th>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink">Bedrooms</th>
              <th className="p-4 font-mono text-xs font-bold uppercase tracking-widest text-ink text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {favorites.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center font-mono text-sm text-arch">
                  NO FAVORITES LOGGED
                </td>
              </tr>
            ) : (
              favorites.map((item) => {
                const property = item.propertyId;
                if (!property) return null;

                return (
                  <tr key={item._id} className="border-b border-arch/10 last:border-0 hover:bg-plaster/50 transition-colors">
                    <td className="p-4 font-bold text-ink">{property.title}</td>
                    <td className="p-4 text-arch">{property.propertyType}</td>
                    <td className="p-4 text-arch">{property.location}</td>
                    <td className="p-4 font-mono font-bold text-ink">${property.rent}</td>
                    <td className="p-4 font-mono text-arch">{property.bathrooms || 1}</td>
                    <td className="p-4 font-mono text-arch">{property.bedrooms || 1}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={async () => {
                          const res = await fetchWithAuth(`/favorites/${property._id}`, { method: "DELETE" });
                          if (res.ok) {
                            setFavorites((prev) => prev.filter((f) => f.propertyId?._id !== property._id));
                            toast("Removed from favorites", "info");
                          } else {
                            toast("Could not remove favorite", "error");
                          }
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center bg-red-50 text-red-500 transition-colors hover:bg-red-500 hover:text-white border border-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
