import MenuButton from "../src/components/ui/buttons/menuButton";
import VideoButton from "../src/components/ui/buttons/videoButton";

export default function Home() {
  return (
    <main
      style={{
        padding: 40,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div className="w-[193px] flex flex-col gap-[6px] items-start mb-2">
        <MenuButton />
        <VideoButton />
      </div>
    </main>
  );
}