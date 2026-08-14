import Nav from "@/components/Nav";
import SceneArrival from "@/components/scenes/SceneArrival";
import SceneAwakens from "@/components/scenes/SceneAwakens";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <SceneArrival />
        <SceneAwakens />
        <section className="flex h-[60dvh] items-center justify-center border-t border-line bg-bg-elevated px-6 text-center">
          <p className="font-display text-[0.7rem] tracking-[0.18em] text-muted uppercase">
            Scene 03 — Nature Meets Architecture · in progress
          </p>
        </section>
      </main>
    </>
  );
}
