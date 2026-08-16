import Nav from "@/components/Nav";
import SceneArrival from "@/components/scenes/SceneArrival";
import SceneAwakens from "@/components/scenes/SceneAwakens";
import SceneTransformation from "@/components/scenes/SceneTransformation";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <SceneArrival />
        <SceneAwakens />
        <SceneTransformation />
      </main>
    </>
  );
}
