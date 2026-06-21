"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  return (
    <main className="mx-auto flex max-w-7xl items-center px-6 py-14 lg:px-10">
      <Card className="mx-auto w-full max-w-lg border border-slate-200 bg-white/90">
        <Card.Content className="gap-5 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-900/70">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Login</h1>
          </div>
          <Input label="Email" value={form.email} onValueChange={(email) => setForm((p) => ({ ...p, email }))} />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onValueChange={(password) => setForm((p) => ({ ...p, password }))}
          />
          <Button
            color="primary"
            isLoading={busy}
            onPress={async () => {
              setBusy(true);
              await authClient.signIn.email({
                email: form.email,
                password: form.password,
              });
              router.push("/dashboard");
            }}
          >
            Login
          </Button>
          <Button
            variant="flat"
            onPress={async () => {
              await authClient.signIn.oauth2({ providerId: "google" });
            }}
          >
            Continue with Google
          </Button>
        </Card.Content>
      </Card>
    </main>
  );
}
