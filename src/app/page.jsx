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
    <main className="bg-drafting min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-arch/20 bg-blueprint">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block border border-ink/10 bg-white px-3 py-1 mb-6 text-xs font-mono tracking-widest text-ink">
                  VOL 01. PROPERTY RENTAL
                </div>
                <h1 className="font-display text-5xl font-bold tracking-tight text-ink lg:text-7xl leading-[1.1]">
                  Discover Your Next Dimension.
                </h1>
                <p className="mt-6 text-lg text-arch max-w-lg leading-relaxed">
                  Bypass the generic listings. Find, measure, and secure your perfect space through our streamlined rental platform.
                </p>

                {/* SEARCH FORM */}
                <form action="/properties" method="get" className="mt-10 bg-white border border-arch/20 shadow-sm flex flex-col md:flex-row p-2 gap-2">
                  <div className="flex-1 border-b md:border-b-0 md:border-r border-arch/10">
                    <input type="text" name="search" placeholder="Location..." className="w-full h-full px-4 py-3 text-sm focus:outline-none" />
                  </div>
                  <div className="flex-1 border-b md:border-b-0 md:border-r border-arch/10">
                    <select name="type" className="w-full h-full px-4 py-3 text-sm bg-transparent focus:outline-none">
                      <option value="">Any Format</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  <div className="w-full md:w-24 border-b md:border-b-0 md:border-r border-arch/10">
                    <input type="number" name="minPrice" placeholder="Min $" className="w-full h-full px-4 py-3 text-sm font-mono focus:outline-none" />
                  </div>
                  <div className="w-full md:w-24">
                    <input type="number" name="maxPrice" placeholder="Max $" className="w-full h-full px-4 py-3 text-sm font-mono focus:outline-none" />
                  </div>
                  <button type="submit" className="bg-ink px-8 py-3 text-sm font-bold tracking-widest text-white hover:bg-blueprint transition-colors">
                    SEARCH
                  </button>
                </form>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-blueprint/5 translate-x-4 translate-y-4 border border-blueprint/20" />
                <div 
                  className="relative h-[600px] w-full bg-cover bg-center border border-arch/20 shadow-2xl"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80')" }}
                >
                  {/* Mock Dimension Line */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-white/70" />
                    <span className="bg-ink/80 px-3 py-1 font-mono text-xs text-white backdrop-blur-md">1,200 SQFT</span>
                    <div className="h-[1px] flex-1 bg-white/70" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <FadeIn>
          <div className="flex items-end justify-between mb-12 border-b border-arch/20 pb-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-arch">Approved Selection</p>
              <h2 className="mt-2 font-display text-4xl font-bold text-ink">Featured Spaces</h2>
            </div>
            <Link href="/properties" className="text-sm font-bold tracking-widest text-blueprint hover:text-ink transition-colors">
              VIEW ALL
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                ctaHref={`/properties/${property._id}`}
              />
            ))}
          </div>
        </FadeIn>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-arch/20 bg-plaster py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <FadeIn>
            <div className="mb-16 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-arch">The Process</p>
              <h2 className="mt-2 font-display text-4xl font-bold text-ink">Blueprint to Reality</h2>
            </div>
            <div className="grid gap-12 md:grid-cols-3 relative">
              <div className="hidden md:block absolute top-6 left-[16.66%] w-[66.66%] h-[1px] bg-arch/30 border-dashed border-t border-arch/40"></div>
              
              <div className="relative bg-white p-8 border border-arch/10 shadow-sm text-center z-10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center bg-blueprint text-white font-mono text-lg font-bold">01</div>
                <h3 className="mt-6 font-display text-2xl font-bold text-ink">Measure</h3>
                <p className="mt-3 text-arch text-sm leading-relaxed">Search locations, filter by exact parameters, and review layout specifications before making a decision.</p>
              </div>

              <div className="relative bg-white p-8 border border-arch/10 shadow-sm text-center z-10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center bg-blueprint text-white font-mono text-lg font-bold">02</div>
                <h3 className="mt-6 font-display text-2xl font-bold text-ink">Draft</h3>
                <p className="mt-3 text-arch text-sm leading-relaxed">Submit your booking request directly to verified owners with our standardized contract workflow.</p>
              </div>

              <div className="relative bg-white p-8 border border-arch/10 shadow-sm text-center z-10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center bg-highlight text-ink font-mono text-lg font-bold">03</div>
                <h3 className="mt-6 font-display text-2xl font-bold text-ink">Occupy</h3>
                <p className="mt-3 text-arch text-sm leading-relaxed">Once approved, receive your virtual keys and manage your tenancy seamlessly through the dashboard.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHY CHOOSE US & REVIEWS */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <FadeIn>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="bg-ink p-10 lg:p-16 text-white flex flex-col justify-center border border-ink shadow-xl">
              <p className="font-mono text-xs uppercase tracking-widest text-arch/70">Structural Integrity</p>
              <h2 className="mt-4 font-display text-4xl font-bold">A Foundation Built on Trust</h2>
              <p className="mt-6 leading-relaxed text-slate-300">
                We reject the chaos of generic classifieds. Every owner is vetted, every listing is approved by an administrator, and every transaction is secured. No fake listings, no hidden fees. Just clear spaces and straight lines.
              </p>
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                <div>
                  <p className="font-mono text-3xl font-bold text-highlight">100%</p>
                  <p className="mt-2 text-sm text-slate-400">Verified Owners</p>
                </div>
                <div>
                  <p className="font-mono text-3xl font-bold text-highlight">24h</p>
                  <p className="mt-2 text-sm text-slate-400">Average Approval</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 lg:p-16 border border-arch/20">
              <p className="font-mono text-xs uppercase tracking-widest text-arch">Resident Logs</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink mb-8">Client Feedback</h2>
              <div className="grid gap-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-l-2 border-blueprint pl-6 py-2">
                    <p className="text-sm italic leading-relaxed text-slate-600">"{review.comment}"</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-bold text-ink font-display">{review.name}</p>
                      <p className="font-mono text-sm text-blueprint">RATING: {review.rating}/5</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* TOP LOCATIONS */}
      <section className="border-t border-arch/20 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <FadeIn>
            <div className="mb-12 border-b border-arch/20 pb-6">
              <p className="font-mono text-xs uppercase tracking-widest text-arch">Zoning Map</p>
              <h2 className="mt-2 font-display text-4xl font-bold text-ink">Prime Sectors</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {['Dhaka', 'Khulna', 'Barisal', 'Chittagong'].map((city) => (
                <Link href={`/properties?search=${city}`} key={city} className="group relative h-64 overflow-hidden bg-ink">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-500 group-hover:opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600&q=80')" }} />
                  <div className="absolute inset-0 border border-white/10 m-3 group-hover:border-blueprint/50 transition-colors" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <h3 className="font-display text-2xl font-bold text-white tracking-wide">{city}</h3>
                    <span className="text-blueprint font-mono text-sm group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
