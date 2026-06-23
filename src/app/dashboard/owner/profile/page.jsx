"use client";

import { authClient } from "@/lib/auth-client";

export default function OwnerProfilePage() {
  const { data } = authClient.useSession();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-arch/20 pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">Entity Profile</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-arch mt-1">Owner Identification</p>
      </div>

      <div className="border border-arch/20 bg-white shadow-sm p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8 border-b border-arch/20 pb-8">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-plaster border border-arch/20 p-1">
            {data?.user?.image ? (
              <img 
                src={data.user.image} 
                alt={data.user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-blueprint text-3xl font-bold font-display text-white">
                {data?.user?.name?.charAt(0) ?? "O"}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-display text-3xl font-bold text-ink">{data?.user?.name}</h3>
            <p className="font-mono text-arch mt-1">{data?.user?.email}</p>
            <span className="inline-block mt-3 px-2 py-1 bg-ink text-highlight text-xs font-bold font-mono uppercase tracking-widest">
              {data?.user?.role || "OWNER"}
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4 py-3 border-b border-arch/10">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-arch">Full Legal Name</div>
            <div className="col-span-2 font-bold text-ink">{data?.user?.name}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 py-3 border-b border-arch/10">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-arch">Email Address</div>
            <div className="col-span-2 font-bold text-ink">{data?.user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
