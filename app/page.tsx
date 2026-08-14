import Nav from "@/components/Nav";
import ScrollRefresh from "@/components/ScrollRefresh";
import SceneArrival from "@/components/scenes/SceneArrival";
import SceneAwakens from "@/components/scenes/SceneAwakens";
import SceneArchitecture from "@/components/scenes/SceneArchitecture";
import SceneTransformation from "@/components/scenes/SceneTransformation";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <SceneArrival />
        <SceneAwakens />
        <SceneArchitecture />
        <SceneTransformation />
        <section className="flex h-[60dvh] items-center justify-center border-t border-line bg-bg-elevated px-6 text-center">
          <p className="font-ui text-[0.7rem] font-medium tracking-[0.18em] text-muted uppercase">
            Scene 05 — Selected Projects · in progress
          </p>
        </section>
      </main>
      <ScrollRefresh />
    </>
  );
}
