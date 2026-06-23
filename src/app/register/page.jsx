"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FadeIn } from "@/components/animated";
import { useToast } from "@/components/toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const { data, isPending } = authClient.useSession();

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
            <p className="font-mono text-xs uppercase tracking-widest text-arch">New Record</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-ink">Entity Registration</h1>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Full Legal Name</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} 
                className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" 
              />
            </div>

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
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Identification Photo</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0])} 
                className="w-full border border-arch/20 bg-white px-4 py-2.5 text-sm file:mr-4 file:border-0 file:bg-arch/10 file:px-4 file:py-2 file:text-sm file:font-semibold focus:border-blueprint focus:outline-none transition-colors" 
              />
            </div>
            
            <div>
              <label className="mb-2 block font-mono text-xs font-bold text-ink uppercase tracking-widest">Secure Passcode</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} 
                className="w-full border border-arch/20 bg-plaster px-4 py-3 text-sm focus:border-blueprint focus:bg-white focus:outline-none transition-colors" 
              />
            </div>
            
            <div className="pt-4">
              <button
                onClick={async () => {
                  setBusy(true);
                  try {
                    let imageUrl = "";
                    if (file) {
                      const formData = new FormData();
                      formData.append("image", file);
                      const uploadRes = await fetch("/api/uploads/imgbb", {
                        method: "POST",
                        body: formData,
                      });
                      if (uploadRes.ok) {
                        const data = await uploadRes.json();
                        imageUrl = data.url;
                      }
                    }

                    const { error } = await authClient.signUp.email({
                      name: form.name,
                      email: form.email,
                      password: form.password,
                      image: imageUrl,
                    });

                    if (error) {
                      toast(error.message || "Registration failed", "error");
                      setBusy(false);
                      return;
                    }
                    
                    router.push("/dashboard");
                  } catch (e) {
                    toast("Something went wrong — please try again", "error");
                    setBusy(false);
                  }
                }}
                disabled={busy}
                className="w-full bg-ink px-4 py-4 text-sm font-bold tracking-widest text-white transition-colors hover:bg-blueprint disabled:opacity-50"
              >
                {busy ? "PROCESSING..." : "SUBMIT REGISTRATION"}
              </button>
            </div>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}
