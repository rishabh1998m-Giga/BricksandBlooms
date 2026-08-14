import Nav from "@/components/Nav";
import ScrollRefresh from "@/components/ScrollRefresh";
import SceneArrival from "@/components/scenes/SceneArrival";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <SceneArrival />
        <section className="flex h-[60dvh] items-center justify-center border-t border-line bg-bg-elevated px-6 text-center">
          <p className="font-ui text-[0.7rem] font-medium tracking-[0.18em] text-muted uppercase">
            Scene 02 — The Typographic World · in progress
          </p>
        </section>
      </main>
      <ScrollRefresh />
    </>
  );
}
