"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);

  return (
    <main className="mx-auto flex max-w-7xl items-center px-6 py-14 lg:px-10">
      <Card className="mx-auto w-full max-w-lg border border-slate-200 bg-white/90">
        <Card.Content className="gap-5 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-900/70">Create an account</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Register</h1>
          </div>
          <Input label="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <Input label="Photo URL" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
          <Button
            color="primary"
            isLoading={busy}
            onPress={async () => {
              setBusy(true);
              await authClient.signUp.email({
                name: form.name,
                email: form.email,
                password: form.password,
                image: form.image,
              });
              router.push("/dashboard");
            }}
          >
            Register
          </Button>
        </Card.Content>
      </Card>
    </main>
  );
}
