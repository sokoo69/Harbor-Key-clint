"use client";

import { RouterProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@/components/toast";

export function Providers({ children }) {
  const router = useRouter();
  return (
    <RouterProvider navigate={router.push}>
      <ToastProvider>{children}</ToastProvider>
    </RouterProvider>
  );
}
