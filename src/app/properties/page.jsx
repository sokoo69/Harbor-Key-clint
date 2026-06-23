import Link from "next/link";
import { FadeIn } from "@/components/animated";
import { PropertyCard } from "@/components/property-card";

async function getProperties(searchParams) {
  const query = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/properties?${query.toString()}`, {
      cache: "no-store",
    });
    if (!response.ok) return { properties: [], page: 1, pages: 1 };
    return response.json();
  } catch (error) {
    return { properties: [], page: 1, pages: 1 };
  }
}

export default async function PropertiesPage({ searchParams }) {
  const params = await searchParams;
  const { properties = [], page = 1, pages = 1 } = await getProperties(params);

  return (
    <main className="min-h-screen bg-drafting">
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden bg-ink py-16 text-white border-b border-arch/20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-blueprint mb-3">Verified Listings</p>
          <h1 className="text-4xl font-bold font-display">All Properties</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <FadeIn>
          {/* FILTER BAR */}
          <div className="mb-10 bg-white border border-arch/20 shadow-sm p-2">
            <form className="grid gap-2 md:grid-cols-6" action="/properties" method="get">
              <InputField name="search" placeholder="Location..." defaultValue={params.search} />
              <select name="type" defaultValue={params.type ?? ""} className="w-full h-full min-h-[48px] px-4 text-sm bg-transparent border border-arch/10 focus:outline-none focus:border-blueprint transition-colors">
                <option value="">Any Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
              <InputField name="minPrice" placeholder="Min $" defaultValue={params.minPrice} isNumber />
              <InputField name="maxPrice" placeholder="Max $" defaultValue={params.maxPrice} isNumber />
              <select name="sort" defaultValue={params.sort ?? "recent"} className="w-full h-full min-h-[48px] px-4 text-sm bg-transparent border border-arch/10 focus:outline-none focus:border-blueprint transition-colors">
                <option value="recent">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <button type="submit" className="bg-ink h-full min-h-[48px] text-white text-sm font-bold tracking-widest hover:bg-blueprint transition-colors">
                FILTER
              </button>
            </form>
          </div>
          
          {/* PROPERTIES GRID */}
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {properties.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3 text-center py-24 bg-white border border-arch/20 border-dashed">
                <p className="font-mono text-xs uppercase tracking-widest text-arch">Error 404</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-ink">No Specifications Found</h3>
                <p className="mt-2 text-arch text-sm">Adjust your parameters and recalibrate the search.</p>
              </div>
            ) : (
              properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  ctaHref={`/properties/${property._id}`}
                />
              ))
            )}
          </div>

          {/* PAGINATION */}
          {pages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-arch/20 pt-6">
              <span className="font-mono text-sm text-arch">
                PAGE {page} OF {pages}
              </span>
              <div className="flex gap-2">
                {page > 1 && <PageLink params={params} page={page - 1}>PREV</PageLink>}
                {page < pages && <PageLink params={params} page={page + 1}>NEXT</PageLink>}
              </div>
            </div>
          )}
        </FadeIn>
      </section>
    </main>
  );
}

function InputField({ name, placeholder, defaultValue, isNumber }) {
  return (
    <input 
      type={isNumber ? "number" : "text"}
      name={name} 
      defaultValue={defaultValue} 
      placeholder={placeholder} 
      className={`w-full h-full min-h-[48px] px-4 text-sm bg-transparent border border-arch/10 focus:outline-none focus:border-blueprint transition-colors ${isNumber ? 'font-mono' : ''}`} 
    />
  );
}

function PageLink({ params, page, children }) {
  const next = new URLSearchParams();
  Object.entries({ ...params, page: String(page) }).forEach(([key, value]) => {
    if (value) next.set(key, value);
  });
  return (
    <Link 
      className="bg-ink px-6 py-2 text-xs font-mono font-bold text-white hover:bg-blueprint transition-colors" 
      href={`/properties?${next.toString()}`}
    >
      {children}
    </Link>
  );
}
