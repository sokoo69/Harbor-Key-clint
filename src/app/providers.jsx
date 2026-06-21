"use client";

import { RouterProvider } from "@heroui/react";
import { useRouter } from "next/navigation";

export function Providers({ children }) {
  const router = useRouter();
  return <RouterProvider navigate={router.push}>{children}</RouterProvider>;
}
