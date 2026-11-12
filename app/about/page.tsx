import type { Metadata } from "next";
import Nav from "@/components/Nav";
import AboutExperience from "@/components/AboutExperience";

export const metadata: Metadata = {
  title: "About — Brick & Blooms",
  description:
    "Six years of custom exterior landscape architecture and turnkey execution across India. No templates, no repetition — every project starts from a blank canvas.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <AboutExperience />
      </main>
    </>
  );
}
