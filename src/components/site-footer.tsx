import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-amber-900/10 bg-white/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between lg:px-10">
        <p>Harbor & Key — rentals, bookings, and moderation in one place.</p>
        <div className="flex gap-4">
          <Link href="/properties">All Properties</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </footer>
  );
}
