import Nav from "@/components/Nav";
import SceneArrival from "@/components/scenes/SceneArrival";
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
      <main className="relative z-10">
        <SceneArrival />
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
