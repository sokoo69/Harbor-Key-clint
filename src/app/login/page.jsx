"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FadeIn } from "@/components/animated";

export default function LoginPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && data?.session) {
      router.replace("/dashboard");
    }
  }, [data, isPending, router]);

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-drafting bg-blueprint py-12 px-6">
      <FadeIn>
        <div className="w-full max-w-md border border-arch/20 bg-white p-8 lg:p-12 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-blueprint"></div>
          
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-arch">System Access</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-ink">Identity Verification</h1>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} 
                className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" 
              />
            </div>
            
            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Passcode</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} 
                className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" 
              />
            </div>
            
            <div className="pt-4 space-y-4">
              <button
                onClick={async () => {
                  setBusy(true);
                  await authClient.signIn.email({
                    email: form.email,
                    password: form.password,
                  });
                  router.push("/dashboard");
                }}
                disabled={busy}
                className="w-full bg-ink px-4 py-4 text-sm font-bold tracking-widest text-white transition-colors hover:bg-blueprint disabled:opacity-50"
              >
                {busy ? "AUTHENTICATING..." : "AUTHORIZE ACCESS"}
              </button>
              
              <button
                onClick={async () => {
                  await authClient.signIn.social({ 
                    provider: "google",
                    callbackURL: "/dashboard" 
                  });
                }}
                className="w-full border border-arch/20 bg-white px-4 py-4 text-sm font-bold tracking-widest text-ink transition-colors hover:bg-plaster"
              >
                CONTINUE WITH GOOGLE
              </button>
            </div>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}
