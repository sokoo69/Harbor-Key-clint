import { Spinner } from "@heroui/react";
import { FadeIn } from "@/components/animated";

export default function Loading() {
  return (
    <FadeIn>
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" color="primary" label="Loading Harbor & Key..." />
      </div>
    </FadeIn>
  );
}
