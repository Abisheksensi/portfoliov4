// components/FloatingUI.tsx
import MenuButton from "../buttons/menuButton";
import VideoButton from "../buttons/videoButton";
import AiWidget from "../aiWidget";

export default function FloatingUI() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Top Right — Menu + Video */}
      <div className="absolute top-4 right-4 flex flex-col gap-[3px] pointer-events-auto">
        <MenuButton />
        <VideoButton />
      </div>

      {/* Bottom Left — AI Widget */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <AiWidget />
      </div>
    </div>
  );
}