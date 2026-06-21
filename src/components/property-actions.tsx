"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, TextArea } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetcher";

export function PropertyActions({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const { data } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [form, setForm] = useState({
    moveInDate: "",
    contactNumber: "",
    additionalNotes: "",
  });

  if (!data?.session) {
    return (
      <Button as="a" href="/login" className="bg-amber-700 text-white hover:bg-amber-800">
        Login to book
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="flat"
        onPress={async () => {
          if (navigator.share) {
            await navigator.share({
              title: "Check out this property",
              url: window.location.href,
            }).catch(() => {});
          } else {
            await navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
          }
        }}
      >
        Share
      </Button>
      <Button
        variant="flat"
        isLoading={favoriteBusy}
        onPress={async () => {
          setFavoriteBusy(true);
          await fetchWithAuth(`/favorites/${propertyId}`, { method: "POST" });
          setFavoriteBusy(false);
        }}
      >
        Add to favorites
      </Button>
      <Button onPress={() => setOpen(true)} className="bg-amber-700 text-white hover:bg-amber-800">
        Book property
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-950">Book this property</h3>
            <div className="mt-5 space-y-4">
              <Input
                label="Move-in date"
                type="date"
                value={form.moveInDate}
                onChange={(e) => setForm((prev) => ({ ...prev, moveInDate: e.target.value }))}
              />
              <Input
                label="Contact number"
                value={form.contactNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, contactNumber: e.target.value }))}
              />
              <TextArea
                label="Additional notes"
                value={form.additionalNotes}
                onChange={(e) => setForm((prev) => ({ ...prev, additionalNotes: e.target.value }))}
              />
              <p className="text-sm text-slate-600">Booking will continue to Stripe after you confirm.</p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="flat" onPress={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                isLoading={busy}
                className="bg-amber-700 text-white hover:bg-amber-800"
                onPress={async () => {
                  setBusy(true);
                  const response = await fetchWithAuth("/payments/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      propertyId,
                      moveInDate: form.moveInDate,
                      contactNumber: form.contactNumber,
                      additionalNotes: form.additionalNotes,
                    }),
                  });
                  const data = (await response.json()) as { url: string };
                  setBusy(false);
                  setOpen(false);
                  router.push(data.url);
                }}
              >
                Continue to payment
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
