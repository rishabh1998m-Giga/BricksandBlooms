import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ServicesIndex from "@/components/ServicesIndex";

export const metadata: Metadata = {
  title: "Services — Brick & Blooms",
  description:
    "Fifteen disciplines under one studio — from terrace gardens and villa landscaping to irrigation, hardscape, and ongoing maintenance.",
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <ServicesIndex />
      </main>
    </>
  );
}
