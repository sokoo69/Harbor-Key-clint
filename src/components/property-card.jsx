import Link from "next/link";
import { Button, Card, Chip } from "@heroui/react";

export function PropertyCard({ property, ctaHref, loggedIn }) {
  return (
    <Card className="h-full border border-slate-200 bg-white/90">
      <Card.Content className="gap-4">
        <div
          className="h-48 rounded-2xl bg-cover bg-center"
          style={{
            backgroundImage: `url(${property.images?.[0] ?? "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80"})`,
          }}
        />
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-950">{property.title}</h3>
          {property.status && <Chip size="sm">{property.status}</Chip>}
        </div>
        <p className="text-sm text-slate-600">{property.location}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-700">
            {property.propertyType} • {property.rentType}
          </p>
          <p className="text-lg font-semibold text-slate-950">${property.rent}</p>
        </div>
        <Button as={Link} href={ctaHref} className="w-full bg-amber-700 text-white hover:bg-amber-800">
          {loggedIn ? "View Details" : "Login to view"}
        </Button>
      </Card.Content>
    </Card>
  );
}
