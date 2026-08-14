import Nav from "@/components/Nav";
import SceneArrival from "@/components/scenes/SceneArrival";
import SceneAwakens from "@/components/scenes/SceneAwakens";
import SceneArchitecture from "@/components/scenes/SceneArchitecture";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <SceneArrival />
        <SceneAwakens />
        <SceneArchitecture />
        <section className="flex h-[60dvh] items-center justify-center border-t border-line bg-bg-elevated px-6 text-center">
          <p className="font-ui text-[0.7rem] font-medium tracking-[0.18em] text-muted uppercase">
            Scene 04 — The Transformation · in progress
          </p>
        </section>
      </main>
    </>
  );
}
