"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { PropertyActions } from "@/components/property-actions";
import { ReviewForm } from "@/components/review-form";
import { fetchWithAuth } from "@/lib/fetcher";
import { FadeIn } from "@/components/animated";

export default function PropertyDetailsPage() {
  return (
    <AuthGuard>
      <FadeIn>
        <PropertyDetails />
      </FadeIn>
    </AuthGuard>
  );
}

function PropertyDetails() {
  const params = useParams();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const reviewResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/property/${params.id}`);
    const reviewData = await reviewResponse.json();
    setReviews(reviewData.reviews ?? []);
  };

  useEffect(() => {
    async function load() {
      const propertyResponse = await fetchWithAuth(`/properties/${params.id}`);
      const propertyData = await propertyResponse.json();
      setProperty(propertyData.property);
      await fetchReviews();
    }

    void load();
  }, [params.id]);

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-drafting">
        <div className="font-mono text-sm tracking-widest text-arch animate-pulse">Loading Specifications...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-drafting">
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden bg-ink py-12 text-white border-b border-arch/20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-blueprint mb-3">ID: {property._id}</p>
          <h1 className="text-4xl font-bold font-display tracking-tight lg:text-5xl">{property.title}</h1>
          <p className="mt-4 font-mono text-sm text-arch">LOC: {property.location}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* LEFT COLUMN: IMAGES & DETAILS */}
        <div className="space-y-10">
          <div className="border border-arch/20 bg-white p-2 shadow-sm">
            <img
              src={property.images?.[0] ?? "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80"}
              alt={property.title}
              className="h-[500px] w-full object-cover"
            />
          </div>

          <div className="bg-white border border-arch/20 p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-ink border-b border-arch/20 pb-4">Structural Overview</h2>
            <p className="mt-6 leading-8 text-arch whitespace-pre-wrap">{property.description}</p>
            
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-arch/20 pt-6 sm:grid-cols-4">
              <div>
                <p className="font-mono text-xs text-arch uppercase">Type</p>
                <p className="mt-1 font-bold text-ink">{property.propertyType}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-arch uppercase">Bedrooms</p>
                <p className="mt-1 font-mono font-bold text-ink">{property.bedrooms || "-"}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-arch uppercase">Bathrooms</p>
                <p className="mt-1 font-mono font-bold text-ink">{property.bathrooms || "-"}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-arch uppercase">Size</p>
                <p className="mt-1 font-mono font-bold text-ink">{property.size ? `${property.size} SQFT` : "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION PANEL */}
        <aside className="space-y-6">
          <div className="sticky top-24 bg-white border border-arch/20 p-8 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-widest text-arch">Financials</p>
            <div className="mt-4 flex items-end gap-2 border-b border-arch/20 pb-6">
              <span className="font-mono text-4xl font-bold text-ink">${property.rent}</span>
              <span className="font-mono text-sm text-arch mb-1">/ {property.rentType === "Monthly" ? "MONTH" : property.rentType}</span>
            </div>
            <div className="mt-6">
              <PropertyActions propertyId={property._id} />
            </div>
          </div>
        </aside>
      </section>

      {/* REVIEWS SECTION */}
      <section className="border-t border-arch/20 bg-plaster py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-3xl font-bold text-ink">Resident Feedback</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {reviews.length === 0 ? (
              <div className="col-span-full border border-arch/20 bg-white p-8 text-center">
                <p className="font-mono text-sm text-arch">No logs recorded for this space yet.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <article key={review._id} className="border-l-4 border-blueprint bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <strong className="font-display text-lg text-ink">{review.name}</strong>
                    <span className="font-mono text-sm text-blueprint bg-blueprint/10 px-2 py-1">RATING: {review.rating}/5</span>
                  </div>
                  <p className="text-sm leading-relaxed text-arch">{review.comment}</p>
                </article>
              ))
            )}
          </div>

          <div className="mt-12 max-w-2xl bg-white border border-arch/20 p-8 shadow-sm">
            <h3 className="font-display text-xl font-bold text-ink mb-6 border-b border-arch/10 pb-4">Submit a Log</h3>
            <ReviewForm propertyId={params.id} onSuccess={fetchReviews} />
          </div>
        </div>
      </section>
    </main>
  );
}
