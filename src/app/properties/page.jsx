import Link from "next/link";
import { Button } from "@heroui/react";
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
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <section className="rounded-[2rem] bg-white p-6">
        <form className="grid gap-3 md:grid-cols-5" action="/properties" method="get">
          <InputField name="search" placeholder="Location" defaultValue={params.search} />
          <select name="type" defaultValue={params.type ?? ""} className="rounded-xl border border-slate-200 px-4 py-3 bg-white">
            <option value="">Any Type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Commercial">Commercial</option>
          </select>
          <InputField name="minPrice" placeholder="Min price" defaultValue={params.minPrice} />
          <InputField name="maxPrice" placeholder="Max price" defaultValue={params.maxPrice} />
          <select name="sort" defaultValue={params.sort ?? "recent"} className="rounded-xl border border-slate-200 px-4 py-3 bg-white">
            <option value="recent">Newest</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
          <div className="md:col-span-5">
            <Button type="submit" className="bg-amber-700 text-white hover:bg-amber-800">
              Search listings
            </Button>
          </div>
        </form>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {properties.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3 text-center py-20 rounded-[2rem] bg-slate-50 border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-950">No properties found</h3>
            <p className="mt-2 text-slate-600">Try adjusting your search filters.</p>
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
      </section>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm text-slate-600">
          Page {page} of {pages}
        </span>
        <div className="flex gap-2">
          {page > 1 && <PageLink params={params} page={page - 1}>Previous</PageLink>}
          {page < pages && <PageLink params={params} page={page + 1}>Next</PageLink>}
        </div>
      </div>
    </main>
  );
}

function InputField({ name, placeholder, defaultValue }) {
  return <input name={name} defaultValue={defaultValue} placeholder={placeholder} className="rounded-xl border border-slate-200 px-4 py-3" />;
}

function PageLink({ params, page, children }) {
  const next = new URLSearchParams();
  Object.entries({ ...params, page: String(page) }).forEach(([key, value]) => {
    if (value) next.set(key, value);
  });
  return (
    <Link className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white" href={`/properties?${next.toString()}`}>
      {children}
    </Link>
  );
}
