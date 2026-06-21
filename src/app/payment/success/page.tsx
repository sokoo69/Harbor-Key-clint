"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetcher";
import { FadeIn } from "@/components/animated";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Finalizing your booking...");

  useEffect(() => {
    async function finalize() {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setMessage("Missing payment session.");
        return;
      }

      await fetchWithAuth("/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      setMessage("Payment received. Your booking has been saved.");
      setTimeout(() => router.push("/dashboard/tenant"), 1500);
    }

    void finalize();
  }, [router, searchParams]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6">
      <FadeIn>
        <div className="text-center bg-[#fbf7f1] p-12 rounded-[2rem] border border-amber-900/10 shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-slate-950">Payment Successful</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto">{message}</p>
        </div>
      </FadeIn>
    </main>
  );
}
