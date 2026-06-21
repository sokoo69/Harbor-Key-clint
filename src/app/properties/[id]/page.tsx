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
  const params = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const propertyResponse = await fetchWithAuth(`/properties/${params.id}`);
      const propertyData = await propertyResponse.json();
      const reviewResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/property/${params.id}`);
      const reviewData = await reviewResponse.json();
      setProperty(propertyData.property);
      setReviews(reviewData.reviews ?? []);
    }

    void load();
  }, [params.id]);

  if (!property) {
    return <div className="mx-auto max-w-7xl px-6 py-14">Loading property…</div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <img
            src={property.images?.[0] ?? "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80"}
            alt={property.title}
            className="h-[420px] w-full rounded-[2rem] object-cover"
          />
          <div className="rounded-[1.75rem] bg-white p-6">
            <h1 className="text-4xl font-semibold text-slate-950">{property.title}</h1>
            <p className="mt-2 text-slate-600">{property.location}</p>
            <p className="mt-4 leading-8 text-slate-700">{property.description}</p>
          </div>
        </div>
        <aside className="space-y-6 rounded-[2rem] bg-white p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-900/70">Booking</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">${property.rent}</p>
          </div>
          <PropertyActions propertyId={property._id} />
        </aside>
      </section>

      <section className="mt-10 rounded-[1.75rem] bg-slate-950 p-6 text-white">
        <h2 className="text-2xl font-semibold">Customer reviews</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review._id} className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <strong>{review.name}</strong>
                <span>{review.rating}/5</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">{review.comment}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <ReviewForm propertyId={params.id} />
      </div>
    </main>
  );
}
