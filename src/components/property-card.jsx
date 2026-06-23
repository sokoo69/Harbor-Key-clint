"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function PropertyCard({ property, ctaHref }) {
  const { data } = authClient.useSession();
  const loggedIn = !!data?.session;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden border border-arch/20 bg-white transition-all hover:border-blueprint/40 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-arch/10">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url(${property.images?.[0] ?? "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80"})`,
          }}
        />
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-ink tracking-tight line-clamp-1">{property.title}</h3>
        <p className="mt-1 text-sm text-arch line-clamp-1">{property.location}</p>
        
        <div className="mt-4 flex items-center justify-between border-y border-arch/10 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-arch">
            {property.propertyType} • {property.rentType}
          </p>
          <p className="font-mono text-lg font-bold text-ink">
            ${property.rent}
          </p>
        </div>
        
        <div className="mt-5 mt-auto">
          <Link 
            href={loggedIn ? ctaHref : `/login?callbackUrl=${encodeURIComponent(ctaHref)}`} 
            className="flex w-full items-center justify-center bg-ink py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-blueprint focus:ring-2 focus:ring-blueprint focus:outline-none"
          >
            {loggedIn ? "VIEW DETAILS" : "LOGIN TO VIEW"}
          </Link>
        </div>
      </div>
    </div>
  );
}
