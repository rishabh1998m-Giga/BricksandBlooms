import Nav from "@/components/Nav";
import SceneArrival from "@/components/scenes/SceneArrival";
import SceneAwakens from "@/components/scenes/SceneAwakens";
import SceneTransformation from "@/components/scenes/SceneTransformation";
import SceneProof from "@/components/scenes/SceneProof";
import SceneServices from "@/components/scenes/SceneServices";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <SceneArrival />
        <SceneAwakens />
        <SceneTransformation />
        <SceneProof />
        <SceneServices />
      </main>
    </>
  );
}
