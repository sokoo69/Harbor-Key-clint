import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-ink border-t border-arch/20 text-arch font-mono text-sm pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 font-display text-xl font-bold tracking-tight text-white mb-6 hover:text-blueprint transition-colors">
              <span className="flex h-8 w-8 items-center justify-center bg-blueprint text-xs text-white">H</span>
              Harbor & Key
            </Link>
            <p className="text-arch mb-6 max-w-sm leading-relaxed">
              Architectural precision in property rentals. Providing secure, verified, and well-maintained properties for discerning tenants.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center border border-arch/20 bg-white/5 hover:bg-blueprint hover:text-white transition-colors text-arch">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center border border-arch/20 bg-white/5 hover:bg-blueprint hover:text-white transition-colors text-arch">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center border border-arch/20 bg-white/5 hover:bg-blueprint hover:text-white transition-colors text-arch">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center border border-arch/20 bg-white/5 hover:bg-blueprint hover:text-white transition-colors text-arch">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.004 3.97H5.059z" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold uppercase tracking-widest text-white mb-6 text-xs">Directory</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-blueprint transition-colors">Home</Link></li>
              <li><Link href="/properties" className="hover:text-blueprint transition-colors">All Properties</Link></li>
              <li><Link href="/dashboard" className="hover:text-blueprint transition-colors">Dashboard</Link></li>
              <li><Link href="/login" className="hover:text-blueprint transition-colors">Member Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase tracking-widest text-white mb-6 text-xs">Legal & Info</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-blueprint transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-blueprint transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-blueprint transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blueprint transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase tracking-widest text-white mb-6 text-xs flex items-center justify-between">
              Stay Updated
              <span className="bg-blueprint/20 text-blueprint px-2 py-0.5 text-[10px] rounded-sm">Coming Soon</span>
            </h3>
            <p className="mb-4 text-xs text-arch">Receive platform updates directly to your inbox.</p>
            <div className="flex gap-2 opacity-50 cursor-not-allowed">
              <input type="email" placeholder="Email Address" disabled className="w-full border border-arch/20 bg-white/5 px-3 py-2 text-sm text-white disabled:cursor-not-allowed focus:outline-none" />
              <button disabled className="bg-blueprint px-4 py-2 text-white transition-colors disabled:cursor-not-allowed">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
            <div className="mt-8 space-y-3 text-xs">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-blueprint" /> support@harborandkey.com</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-blueprint" /> +8801234567890</p>
            </div>
          </div>

        </div>

        <div className="border-t border-arch/20 pt-8 text-center text-xs text-arch flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Harbor & Key. All rights reserved.</p>
          <p>Built with precision.</p>
        </div>
      </div>
    </footer>
  );
}
