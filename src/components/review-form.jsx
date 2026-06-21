"use client";

import { useState } from "react";
import { Button, Input, TextArea } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetcher";

export function ReviewForm({ propertyId }) {
  const { data } = authClient.useSession();
  const [form, setForm] = useState({ rating: 5, comment: "" });

  if (!data?.session) return null;

  return (
    <div className="rounded-[1.5rem] bg-white p-5">
      <h3 className="text-lg font-semibold">Write a review</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Input label="Rating" type="number" min={1} max={5} value={String(form.rating)} onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))} />
        <TextArea label="Comment" value={form.comment} onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))} />
      </div>
      <Button
        className="mt-4 bg-amber-700 text-white hover:bg-amber-800"
        onPress={async () => {
          await fetchWithAuth(`/reviews/property/${propertyId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.session.user.name,
              email: data.session.user.email,
              rating: form.rating,
              comment: form.comment,
            }),
          });
        }}
      >
        Submit review
      </Button>
    </div>
  );
}
