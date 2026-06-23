"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetcher";
import { useToast } from "@/components/toast";

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            className={`h-7 w-7 transition-colors ${
              star <= (hovered || value)
                ? "fill-blueprint stroke-blueprint"
                : "fill-none stroke-arch/40"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 font-mono text-sm text-arch">{value}/5</span>
    </div>
  );
}

export function ReviewForm({ propertyId, onSuccess }) {
  const { data } = authClient.useSession();
  const toast = useToast();
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!data?.session) return null;

  const handleSubmit = async () => {
    if (!form.comment.trim()) {
      toast("Please write a comment before submitting", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetchWithAuth(`/reviews/property/${propertyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          rating: form.rating,
          comment: form.comment,
        }),
      });
      if (res.ok) {
        toast("Review submitted — thank you!", "success");
        setForm({ rating: 5, comment: "" });
        if (onSuccess) onSuccess();
      } else {
        toast("Could not submit review, try again", "error");
      }
    } catch {
      toast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-3 block font-mono text-xs font-bold uppercase tracking-widest text-ink">
          Your Rating
        </label>
        <StarRating value={form.rating} onChange={(v) => setForm((p) => ({ ...p, rating: v }))} />
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-ink">
          Comment
        </label>
        <textarea
          rows={4}
          value={form.comment}
          onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
          placeholder="Share your experience with this property..."
          className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="flex items-center gap-2 bg-ink px-6 py-3 text-sm font-bold tracking-widest text-white hover:bg-blueprint transition-colors disabled:opacity-50"
      >
        {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
      </button>
    </div>
  );
}
