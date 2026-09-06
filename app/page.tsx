import Nav from "@/components/Nav";
import WorldCanvas from "@/components/webgl/WorldCanvas";
import SceneArrival from "@/components/scenes/SceneArrival";
import SceneBloom from "@/components/scenes/SceneBloom";
import SceneAwakens from "@/components/scenes/SceneAwakens";
import SceneTransformation from "@/components/scenes/SceneTransformation";
import SceneProof from "@/components/scenes/SceneProof";
import SceneVision from "@/components/scenes/SceneVision";
import SceneServices from "@/components/scenes/SceneServices";
import SceneProcess from "@/components/scenes/SceneProcess";

export default function Home() {
  return (
    <>
      <Nav />
      <WorldCanvas />
      <main className="relative z-10">
        <SceneArrival />
        <SceneBloom />
        <SceneAwakens />
        <SceneTransformation />
        <SceneProof />
        <SceneVision />
        <SceneServices />
        <SceneProcess />
      </main>
    </>
  );
}
