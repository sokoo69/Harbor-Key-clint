"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, X, Eye } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetcher";
import { useToast } from "@/components/toast";

const AMENITIES_LIST = [
  "WiFi", "Parking", "Air Conditioning", "Lift",
  "Security", "Generator", "Gym", "Swimming Pool"
];

export default function OwnerMyPropertiesPage() {
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetchWithAuth("/owner/properties");
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties ?? []);
      }
    }
    void load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    const res = await fetchWithAuth(`/properties/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProperties(prev => prev.filter(p => p._id !== id));
      toast("Property removed from listings", "success");
    } else {
      toast("Could not delete property", "error");
    }
  };

  const handleEditCheckbox = (amenity) => {
    setEditForm(prev => {
      if (prev.amenities.includes(amenity)) {
        return { ...prev, amenities: prev.amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const submitEdit = async () => {
    const response = await fetchWithAuth(`/properties/${editingPropertyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        rent: Number(editForm.rent),
        bedrooms: Number(editForm.bedrooms),
        bathrooms: Number(editForm.bathrooms),
        images: Array.isArray(editForm.images) ? editForm.images : editForm.images.split(",").map((item) => item.trim()).filter(Boolean),
        extraFeatures: Array.isArray(editForm.extraFeatures) ? editForm.extraFeatures : editForm.extraFeatures.split(",").map((item) => item.trim()).filter(Boolean),
      }),
    });
    if (response.ok) {
      const { property } = await response.json();
      setProperties(prev => prev.map(p => p._id === property._id ? property : p));
      setEditingPropertyId(null);
      toast("Property specification updated", "success");
    } else {
      toast("Could not save changes", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-arch/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">My Properties</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-arch mt-1">Property Database</p>
      </div>

      <div className="bg-white border border-arch/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-plaster border-b border-arch/20">
            <tr>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Title</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Location</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Price</th>
              <th className="p-4 text-left font-mono text-xs font-bold uppercase tracking-widest text-ink">Type</th>
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
                <td className="p-4 font-mono text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    {property.status === 'Approved' ? (
                      <span className="text-blueprint">APPROVED</span>
                    ) : property.status === 'Rejected' ? (
                      <span className="text-red-500">REJECTED</span>
                    ) : (
                      <span className="text-highlight bg-ink px-2 py-1">PENDING</span>
                    )}
                    {property.status === 'Rejected' && property.rejectionFeedback && (
                      <button
                        title="View Rejection Feedback"
                        className="text-arch hover:text-ink transition-colors"
                        onClick={() => toast(`Rejection: ${property.rejectionFeedback}`, "info")}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => {
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
                          amenities: property.amenities || [],
                          images: property.images.join(", "),
                          extraFeatures: property.extraFeatures.join(", "),
                        });
                      }}
                      className="text-blueprint hover:text-ink transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(property._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && <tr><td colSpan={6} className="p-8 text-center font-mono text-sm text-arch uppercase tracking-widest">No specifications found.</td></tr>}
          </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPropertyId && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 overflow-y-auto">
          <div className="w-full max-w-3xl border border-arch/20 bg-white p-8 shadow-2xl my-8 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-blueprint"></div>
            <div className="flex items-center justify-between mb-8 border-b border-arch/20 pb-4">
              <h3 className="font-display text-2xl font-bold text-ink">Edit Specification</h3>
              <button onClick={() => setEditingPropertyId(null)} className="text-arch hover:text-ink transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Property Title</label>
                <input value={editForm.title} onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))} className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Location</label>
                <input value={editForm.location} onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))} className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Property Type</label>
                <select value={editForm.propertyType} onChange={(e) => setEditForm(prev => ({ ...prev, propertyType: e.target.value }))} className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors appearance-none">
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Office">Office</option>
                  <option value="Studio">Studio</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Rent Type</label>
                <select value={editForm.rentType} onChange={(e) => setEditForm(prev => ({ ...prev, rentType: e.target.value }))} className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors appearance-none">
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Monthly Rent ($)</label>
                <input type="number" value={editForm.rent} onChange={(e) => setEditForm(prev => ({ ...prev, rent: e.target.value }))} className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm font-mono focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Size (SQFT)</label>
                <input value={editForm.size} onChange={(e) => setEditForm(prev => ({ ...prev, size: e.target.value }))} className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm font-mono focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Bedrooms</label>
                <input type="number" value={editForm.bedrooms} onChange={(e) => setEditForm(prev => ({ ...prev, bedrooms: e.target.value }))} className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm font-mono focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Bathrooms</label>
                <input type="number" value={editForm.bathrooms} onChange={(e) => setEditForm(prev => ({ ...prev, bathrooms: e.target.value }))} className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm font-mono focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
              </div>
            </div>

            <div className="mt-6 border-t border-arch/20 pt-6">
              <label className="mb-4 block font-mono text-xs font-bold text-ink uppercase tracking-widest">System Amenities</label>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {AMENITIES_LIST.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-3 text-sm text-ink cursor-pointer font-bold">
                    <input 
                      type="checkbox" 
                      checked={editForm.amenities.includes(amenity)}
                      onChange={() => handleEditCheckbox(amenity)}
                      className="h-4 w-4 appearance-none border border-arch/40 checked:bg-blueprint checked:border-blueprint transition-colors cursor-pointer"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-arch/20 pt-6">
              <button onClick={() => setEditingPropertyId(null)} className="border border-arch/20 bg-white px-6 py-3 text-sm font-bold tracking-widest text-ink hover:bg-plaster transition-colors">CANCEL</button>
              <button onClick={submitEdit} className="bg-ink px-6 py-3 text-sm font-bold tracking-widest text-white hover:bg-blueprint transition-colors">SAVE CHANGES</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
