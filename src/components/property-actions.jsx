"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@heroui/react";
import { Heart, Share2, CalendarRange } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetcher";
import { useToast } from "@/components/toast";

export function PropertyActions({ propertyId }) {
  const router = useRouter();
  const { data } = authClient.useSession();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [form, setForm] = useState({
    moveInDate: "",
    contactNumber: "",
    additionalNotes: "",
  });

  // Only check favorites for tenants
  useEffect(() => {
    if (!data?.session || data?.user?.role !== "tenant") return;
    fetchWithAuth("/favorites").then(async (res) => {
      if (res.ok) {
        const json = await res.json();
        const ids = (json.favorites ?? []).map((f) => f.propertyId?._id ?? f.propertyId);
        setIsFavorited(ids.includes(propertyId));
      }
    });
  }, [data, propertyId]);

  if (!data?.session) {
    return (
      <a
        href="/login"
        className="block w-full bg-ink py-4 text-center text-sm font-bold tracking-widest text-white hover:bg-blueprint transition-colors"
      >
        LOGIN TO BOOK
      </a>
    );
  }

  // Admins and owners: show book only, no favorites/share
  const isTenant = data?.user?.role === "tenant";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Check out this property", url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast("Link copied to clipboard", "success");
      }
    } catch {}
  };

  const handleFavorite = async () => {
    setFavoriteBusy(true);
    try {
      if (isFavorited) {
        const res = await fetchWithAuth(`/favorites/${propertyId}`, { method: "DELETE" });
        if (res.ok) {
          setIsFavorited(false);
          toast("Removed from favorites", "info");
        } else {
          toast("Could not update favorites", "error");
        }
      } else {
        const res = await fetchWithAuth(`/favorites/${propertyId}`, { method: "POST" });
        if (res.ok) {
          setIsFavorited(true);
          toast("Added to favorites", "success");
        } else {
          toast("Could not update favorites", "error");
        }
      }
    } finally {
      setFavoriteBusy(false);
    }
  };

  const handleBook = async () => {
    setBusy(true);
    try {
      const response = await fetchWithAuth("/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          moveInDate: form.moveInDate,
          contactNumber: form.contactNumber,
          additionalNotes: form.additionalNotes,
        }),
      });
      const data = await response.json();
      if (response.ok && data.url) {
        toast("Redirecting to payment...", "info");
        setOpen(false);
        router.push(data.url);
      } else {
        toast(data?.message || "Booking failed — please try again", "error");
      }
    } catch (err) {
      toast(err?.message || "Something went wrong", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* PRIMARY: Book property */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 bg-ink py-4 text-sm font-bold tracking-widest text-white hover:bg-blueprint transition-colors"
      >
        <CalendarRange className="h-4 w-4" />
        BOOK PROPERTY
      </button>

      {/* SECONDARY: Favorite toggle — tenants only */}
      {isTenant && (
        <button
          onClick={handleFavorite}
          disabled={favoriteBusy}
          className={`flex w-full items-center justify-center gap-2 border py-3 text-sm font-bold tracking-widest transition-colors disabled:opacity-50 ${
            isFavorited
              ? "border-blueprint bg-blueprint text-white"
              : "border-arch/20 bg-white text-ink hover:border-blueprint hover:text-blueprint"
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          {isFavorited ? "SAVED TO FAVORITES" : "ADD TO FAVORITES"}
        </button>
      )}

      {/* GHOST: Share — tenants only */}
      {isTenant && (
        <button
          onClick={handleShare}
          className="flex w-full items-center justify-center gap-2 border border-arch/20 bg-transparent py-3 text-sm font-bold tracking-widest text-arch hover:text-ink hover:border-ink transition-colors"
        >
          <Share2 className="h-4 w-4" />
          SHARE
        </button>
      )}

      {/* Booking Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-5 text-center border-b border-arch/10">
              <h3 className="text-xl font-bold text-ink">Booking Properties</h3>
              <p className="mt-1 text-sm text-arch">Fill in your details below to confirm your booking.</p>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-4">
              {/* Row 1: User Name + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">User Name</label>
                  <input
                    value={data?.user?.name ?? ""}
                    readOnly
                    className="w-full rounded-lg border border-arch/20 bg-plaster px-4 py-2.5 text-sm text-arch cursor-default focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
                  <input
                    value={data?.user?.email ?? ""}
                    readOnly
                    className="w-full rounded-lg border border-arch/20 bg-plaster px-4 py-2.5 text-sm text-arch cursor-default focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Phone + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Phone</label>
                  <input
                    placeholder="017XXXXXXXXX"
                    value={form.contactNumber}
                    onChange={(e) => setForm((p) => ({ ...p, contactNumber: e.target.value }))}
                    className="w-full rounded-lg border border-arch/20 bg-white px-4 py-2.5 text-sm focus:border-blueprint focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Date</label>
                  <input
                    type="date"
                    value={form.moveInDate}
                    onChange={(e) => setForm((p) => ({ ...p, moveInDate: e.target.value }))}
                    className="w-full rounded-lg border border-arch/20 bg-white px-4 py-2.5 text-sm focus:border-blueprint focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Additional Notes <span className="font-normal text-arch">(optional)</span></label>
                <textarea
                  rows={2}
                  placeholder="Any special requests or notes..."
                  value={form.additionalNotes}
                  onChange={(e) => setForm((p) => ({ ...p, additionalNotes: e.target.value }))}
                  className="w-full rounded-lg border border-arch/20 bg-white px-4 py-2.5 text-sm focus:border-blueprint focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-8 pb-8">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-arch/20 bg-white px-6 py-2.5 text-sm font-semibold text-ink hover:bg-plaster transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBook}
                disabled={busy}
                className="rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-white hover:bg-blueprint transition-colors disabled:opacity-50"
              >
                {busy ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
