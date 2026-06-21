"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animated";

export default function Error({ reset }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">
      <FadeIn>
        <div className="text-center bg-[#fff5f5] p-12 rounded-[2rem] border border-red-900/10 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-red-900/70 mb-2">System Error</p>
          <h1 className="text-4xl font-semibold text-slate-950">Something went wrong</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto">
            An unexpected error occurred. You can try again or return to the home page.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={reset} className="rounded-full bg-slate-950 px-6 py-3 text-white hover:bg-slate-800 transition-colors">
              Try again
            </button>
            <Link href="/" className="rounded-full border border-slate-300 px-6 py-3 hover:bg-slate-50 transition-colors">
              Go to Home
            </Link>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}
