"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/fetcher";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/toast";

const AMENITIES_LIST = [
  "WiFi", "Parking", "Air Conditioning", "Lift",
  "Security", "Generator", "Gym", "Swimming Pool"
];

export default function OwnerAddPropertyPage() {
  const { data } = authClient.useSession();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    propertyType: "",
    rentType: "",
    rent: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    extraFeatures: "",
    images: "",
    description: "",
    amenities: []
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckbox = (amenity) => {
    setForm(prev => {
      if (prev.amenities.includes(amenity)) {
        return { ...prev, amenities: prev.amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetchWithAuth("/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rent: Number(form.rent),
          size: form.size, // string or number depending on model
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          images: form.images.split(",").map(i => i.trim()).filter(Boolean),
          extraFeatures: form.extraFeatures.split(",").map(f => f.trim()).filter(Boolean),
          ownerInfo: {
            name: data?.user?.name,
            email: data?.user?.email,
            image: data?.user?.image ?? "",
            role: data?.user?.role,
          },
        }),
      });

      if (res.ok) {
        toast("Property listing submitted for review", "success");
        setForm({
          title: "", location: "", propertyType: "", rentType: "", rent: "", size: "",
          bedrooms: "", bathrooms: "", extraFeatures: "", images: "", description: "", amenities: []
        });
      } else {
        toast("Failed to submit listing — check your inputs", "error");
      }
    } catch (err) {
      toast("Unexpected error — please try again", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-arch/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">New Specification</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-arch mt-1">Property Input Data</p>
      </div>

      <div className="border border-arch/20 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Property Title</label>
              <input required name="title" value={form.title} onChange={handleChange} placeholder="Project Name" className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Location</label>
              <input required name="location" value={form.location} onChange={handleChange} placeholder="Coordinates / Address" className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
            </div>
            
            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Property Type</label>
              <select required name="propertyType" value={form.propertyType} onChange={handleChange} className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors appearance-none">
                <option value="">Select Classification</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Office">Office</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Rent Type</label>
              <select required name="rentType" value={form.rentType} onChange={handleChange} className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors appearance-none">
                <option value="">Select Terms</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Weekly">Weekly</option>
                <option value="Daily">Daily</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Rent Amount ($)</label>
              <input required type="number" name="rent" value={form.rent} onChange={handleChange} placeholder="0.00" className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm font-mono focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Property Size (SQFT)</label>
              <input required name="size" value={form.size} onChange={handleChange} placeholder="0" className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm font-mono focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Bedrooms</label>
              <input required type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} placeholder="0" className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm font-mono focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Bathrooms</label>
              <input required type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} placeholder="0" className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm font-mono focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Extra Features (CSV)</label>
              <input name="extraFeatures" value={form.extraFeatures} onChange={handleChange} placeholder="Balcony, Elevator" className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Image Source (URL)</label>
              <input required name="images" value={form.images} onChange={handleChange} placeholder="https://..." className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Architectural Description</label>
            <textarea required name="description" value={form.description} onChange={handleChange} placeholder="Detailed specification notes..." rows={4} className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" />
          </div>

          <div className="border-t border-arch/20 pt-6">
            <label className="mb-4 block font-mono text-xs font-bold text-ink uppercase tracking-widest">System Amenities</label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {AMENITIES_LIST.map((amenity) => (
                <label key={amenity} className="flex items-center gap-3 text-sm text-ink cursor-pointer font-bold">
                  <input 
                    type="checkbox" 
                    checked={form.amenities.includes(amenity)}
                    onChange={() => handleCheckbox(amenity)}
                    className="h-4 w-4 appearance-none border border-arch/40 checked:bg-blueprint checked:border-blueprint transition-colors cursor-pointer"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-8 flex justify-end border-t border-arch/20">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-ink px-8 py-4 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-blueprint disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : "SUBMIT SPECIFICATION"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
