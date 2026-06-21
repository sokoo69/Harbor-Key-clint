import Link from "next/link";
import { FadeIn } from "@/components/animated";
import { PropertyCard } from "@/components/property-card";

async function getFeaturedProperties() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/properties/featured`, {
      cache: "no-store",
    });
    if (!response.ok) return { properties: [] };
    return response.json();
  } catch (error) {
    return { properties: [] };
  }
}

async function getFeaturedReviews() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/reviews/featured`, {
      cache: "no-store",
    });
    if (!response.ok) return { reviews: [] };
    return response.json();
  } catch (error) {
    return { reviews: [] };
  }
}

export default async function Home() {
  const [{ properties = [] }, { reviews = [] }] = await Promise.all([
    getFeaturedProperties(),
    getFeaturedReviews(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <FadeIn>
        <section className="grid gap-10 rounded-[2rem] border border-amber-900/10 bg-[#fbf7f1] p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-900/70">
              Property rental marketplace
            </p>
            <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight text-slate-950">
              Find a place, book it, and keep the paperwork out of your way.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
              Harbor & Key keeps search, booking, payment, and moderation in one flow
              for tenants, owners, and admins.
            </p>
            <form action="/properties" method="get" className="mt-8 flex flex-wrap items-center gap-3">
              <input type="text" name="search" placeholder="Location..." className="w-full md:w-auto rounded-full border border-slate-200 px-4 py-3 text-sm flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-amber-700/20" />
              <select name="type" className="w-full md:w-auto rounded-full border border-slate-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20">
                <option value="">Any Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
              <input type="number" name="minPrice" placeholder="Min $" className="w-[calc(50%-0.375rem)] md:w-24 rounded-full border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/20" />
              <input type="number" name="maxPrice" placeholder="Max $" className="w-[calc(50%-0.375rem)] md:w-24 rounded-full border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/20" />
              <button type="submit" className="w-full md:w-auto rounded-full bg-amber-700 px-6 py-3 text-sm font-medium text-white hover:bg-amber-800 transition-colors">
                Search
              </button>
            </form>
          </div>
          <div className="rounded-[1.75rem] bg-slate-950 p-6 text-slate-100">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Approved listings", "240+"],
                ["Tenant reviews", "4.8/5"],
                ["Owner response", "< 2h"],
                ["Cities covered", "18"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-300">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-900/70">Featured properties</p>
              <h2 className="text-3xl font-semibold text-slate-950">Approved listings worth a look</h2>
            </div>
            <Link href="/properties" className="text-sm text-slate-700 underline">
              See all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                ctaHref={`/properties/${property._id}`}
              />
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-900/70">Top Locations</p>
            <h2 className="text-3xl font-semibold text-slate-950">Explore popular cities</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {['New York', 'Los Angeles', 'Chicago', 'Miami'].map((city) => (
              <Link href={`/properties?search=${city}`} key={city} className="group relative h-48 overflow-hidden rounded-2xl bg-slate-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent transition-opacity group-hover:opacity-80" />
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-semibold text-white tracking-wide group-hover:underline">{city}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="mt-16 bg-[#fbf7f1] rounded-[2rem] p-8 lg:p-12 border border-amber-900/10">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-900/70">How It Works</p>
            <h2 className="text-3xl font-semibold text-slate-950">Simple steps to your new place</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3 relative">
            <div className="hidden md:block absolute top-8 left-[16.66%] w-[66.66%] h-[2px] bg-amber-900/10"></div>
            <div className="text-center relative z-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-700 text-2xl font-semibold text-white shadow-lg shadow-amber-900/20">1</div>
              <h3 className="mt-6 text-xl font-semibold text-slate-950">Search</h3>
              <p className="mt-3 text-slate-600 px-4">Find the perfect property using our advanced filters and search.</p>
            </div>
            <div className="text-center relative z-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-700 text-2xl font-semibold text-white shadow-lg shadow-amber-900/20">2</div>
              <h3 className="mt-6 text-xl font-semibold text-slate-950">Book</h3>
              <p className="mt-3 text-slate-600 px-4">Request a booking securely online using Stripe checkout.</p>
            </div>
            <div className="text-center relative z-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-700 text-2xl font-semibold text-white shadow-lg shadow-amber-900/20">3</div>
              <h3 className="mt-6 text-xl font-semibold text-slate-950">Move In</h3>
              <p className="mt-3 text-slate-600 px-4">Once the owner approves your request, pack your bags and move in!</p>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] bg-white p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-900/70">Why choose us</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">A clear workflow for both sides</h2>
            <p className="mt-4 leading-7 text-slate-700">
              Owners publish listings, tenants book with confidence, and admins can
              approve or reject records with real feedback instead of vague status tags.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">Customer reviews</p>
            <div className="mt-5 grid gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.name}</p>
                    <p className="text-sm text-amber-200">{review.rating}/5</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
