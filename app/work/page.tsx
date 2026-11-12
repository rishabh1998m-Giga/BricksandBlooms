import type { Metadata } from "next";
import Nav from "@/components/Nav";
import WorkExperience from "@/components/WorkExperience";

export const metadata: Metadata = {
  title: "How We Work — Brick & Blooms",
  description:
    "From first consultation to ongoing maintenance — the five steps every Brick & Blooms project moves through, with no hidden costs along the way.",
};

export default function WorkPage() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <WorkExperience />
      </main>
    </>
  );
}
