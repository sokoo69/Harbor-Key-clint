const highlights = [
  { label: "Verified listings", value: "240+" },
  { label: "Average response time", value: "< 2h" },
  { label: "Cities covered", value: "18" },
];

const steps = [
  "Find a place that matches the way you actually live.",
  "Book, pay, and track the request from one dashboard.",
  "Owners approve listings and bookings without guessing.",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff4e8_0%,_#f5efe6_38%,_#e9ddcf_100%)] text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-slate-300/70 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-900/70">
              Harbor & Key
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Rentals with fewer dead ends.
            </h1>
          </div>
          <div className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
            Tenant, owner, admin workflows in one place
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-amber-900/15 bg-amber-50 px-4 py-2 text-sm text-amber-950 shadow-sm">
              Search, book, pay, and review without bouncing between apps.
            </p>
            <h2 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl">
              A rental marketplace that feels clear the first time you use it.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
              Harbor & Key keeps property search, booking requests, payments,
              and moderation in one flow so each side knows what happens next.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-slate-300 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur"
                >
                  <div className="text-3xl font-semibold text-slate-950">
                    {item.value}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-300 bg-slate-950 p-6 text-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">
              Today&apos;s flow
            </p>
            <div className="mt-5 space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-2xl bg-white/5 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-slate-950">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-200">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
              Built for a marketplace that needs approvals, payments, and
              role-based access without looking like a stock dashboard.
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
