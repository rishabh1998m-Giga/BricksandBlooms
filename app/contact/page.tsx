import type { Metadata } from "next";
import { Suspense } from "react";
import Nav from "@/components/Nav";
import ContactExperience from "@/components/ContactExperience";

export const metadata: Metadata = {
  title: "Contact — Brick & Blooms",
  description:
    "Tell us about your space and your vision — Brick & Blooms will be in touch within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="relative z-10 min-h-dvh">
        <Suspense fallback={null}>
          <ContactExperience />
        </Suspense>
      </main>
    </>
  );
}
