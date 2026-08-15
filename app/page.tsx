import Nav from "@/components/Nav";
import SceneArrival from "@/components/scenes/SceneArrival";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <SceneArrival />
        <section className="flex h-[60dvh] items-center justify-center border-t border-line bg-bg-elevated px-6 text-center">
          <p className="font-display text-[0.7rem] tracking-[0.18em] text-muted uppercase">
            Scene 02 — The Landscape Awakens · in progress
          </p>
        </section>
      </main>
    </>
  );
}
