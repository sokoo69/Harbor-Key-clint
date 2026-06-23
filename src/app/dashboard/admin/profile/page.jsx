"use client";

import { authClient } from "@/lib/auth-client";

export default function AdminProfilePage() {
  const { data } = authClient.useSession();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm p-8 max-w-2xl">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Profile Details</h2>
        
        <div className="flex items-center gap-6 mb-8">
          {data?.user?.image ? (
            <img 
              src={data.user.image} 
              alt={data.user.name} 
              className="w-24 h-24 rounded-full border-4 border-slate-50 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-3xl font-semibold">
              {data?.user?.name?.charAt(0) ?? "A"}
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-medium text-slate-900">{data?.user?.name}</h3>
            <p className="text-slate-500">{data?.user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium uppercase tracking-wider">
              {data?.user?.role || "ADMIN"}
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-3 gap-4 py-3">
            <div className="text-slate-500 text-sm">Full Name</div>
            <div className="col-span-2 text-slate-900 font-medium">{data?.user?.name}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 py-3">
            <div className="text-slate-500 text-sm">Email Address</div>
            <div className="col-span-2 text-slate-900 font-medium">{data?.user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
