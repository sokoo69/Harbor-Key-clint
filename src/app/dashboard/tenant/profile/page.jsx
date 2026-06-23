"use client";

import { authClient } from "@/lib/auth-client";
import { User, Mail, ShieldCheck } from "lucide-react";

export default function TenantProfilePage() {
  const { data } = authClient.useSession();
  const user = data?.user;

  if (!user) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div className="mb-6 border-b border-arch/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">Entity Profile</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-arch mt-1">Tenant Identification</p>
      </div>

      <div className="border border-arch/20 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-6 border-b border-arch/20 pb-8">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-plaster border border-arch/20 p-1">
            {user.image ? (
              <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-blueprint text-3xl font-bold font-display text-white">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">{user.name}</h1>
            <p className="font-mono text-xs font-bold text-arch uppercase tracking-widest mt-1">Registered Tenant</p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center border border-arch/20 bg-plaster text-blueprint">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-arch">Full Name</p>
              <p className="font-bold text-ink mt-1">{user.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center border border-arch/20 bg-plaster text-blueprint">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-arch">Email Address</p>
              <p className="font-bold text-ink mt-1">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center border border-arch/20 bg-plaster text-blueprint">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-arch">Account Role</p>
              <p className="font-mono font-bold text-highlight bg-ink inline-block px-2 py-1 uppercase mt-1">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
