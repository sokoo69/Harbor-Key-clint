"use client";

import { Card } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data } = authClient.useSession();
  const role = data?.user?.role ?? "tenant";

  return (
    <section className="grid gap-6 md:grid-cols-3">
      <Card><Card.Content><h2 className="text-xl font-semibold">Welcome back</h2><p className="text-sm text-slate-600">{data?.user?.name}</p></Card.Content></Card>
      <Card><Card.Content><h2 className="text-xl font-semibold">Your role</h2><p className="text-sm text-slate-600">{role}</p></Card.Content></Card>
      <Card><Card.Content><h2 className="text-xl font-semibold">Quick links</h2><p className="text-sm text-slate-600">Use the tabs above to open the matching dashboard.</p></Card.Content></Card>
    </section>
  );
}
