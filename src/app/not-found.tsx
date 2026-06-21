import Link from "next/link";
import { FadeIn } from "@/components/animated";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">
      <FadeIn>
        <div className="text-center bg-[#fbf7f1] p-12 rounded-[2rem] border border-amber-900/10 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-900/70 mb-2">404 Error</p>
          <h1 className="text-5xl font-semibold text-slate-950">Page not found</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto">
            The link you followed may be broken, or the page may have been removed.
          </p>
          <Link href="/" className="mt-8 inline-block rounded-full bg-slate-950 px-6 py-3 text-white hover:bg-slate-800 transition-colors">
            Return to Home
          </Link>
        </div>
      </FadeIn>
    </main>
  );
}
