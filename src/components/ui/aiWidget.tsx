"use client";

import { useState } from "react";
import { AnimatePresence, easeIn, motion } from "framer-motion";
import Image from "next/image";
import SparkIcon from "./buttons/sparkIcon";
import XIcon from "../../assets/icons/lucide/x.svg";

type WidgetState = "idle" | "collapsing" | "expanding" | "open";

const TEXT_WIPE_DURATION = 100; // Step 1: "Learn together" disappears
const ORB_HOLD_DURATION = 800; // Step 2: Spark orb sits alone briefly
const WIDTH_EXPAND_DURATION = 400; // Step 3: "Ask me anything" slides in

export default function AiWidget() {
  const [widgetState, setWidgetState] = useState<WidgetState>("idle");

  const handleOpen = () => {
    // 1️⃣ Wipe text → collapse to orb
    setWidgetState("collapsing");

    setTimeout(() => {
      // 2️⃣ Orb sits alone, then expand width with "Ask me anything"
      setWidgetState("expanding");
    }, TEXT_WIPE_DURATION + ORB_HOLD_DURATION);

    setTimeout(
      () => {
        // 3️⃣ Expand height to full chat
        setWidgetState("open");
      },
      TEXT_WIPE_DURATION + ORB_HOLD_DURATION + WIDTH_EXPAND_DURATION,
    );
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWidgetState("expanding");
    setTimeout(() => {
      setWidgetState("collapsing");
    }, 600);
    setTimeout(() => {
      setWidgetState("idle");
    }, 600 + 300);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {widgetState === "idle" && (
          <IdleButton key="idle" onOpen={handleOpen} />
        )}
        {widgetState === "collapsing" && <CollapsedOrb key="collapsing" />}
        {widgetState === "expanding" && <InputBar key="expanding" />}
        {widgetState === "open" && (
          <ChatWindow key="open" onClose={handleClose} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── State 1: Idle Button ─────────────── */
function IdleButton({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button
      layoutId="widget-container"
      onClick={onOpen}
      whileTap={{ scale: 0.95 }}
      style={{ borderRadius: 32 }}
      className="flex items-center gap-4 overflow-hidden bg-stone-950 px-4 py-3.5 cursor-pointer hover:bg-neutral-900"
    >
      <motion.div layoutId="widget-icon">
        <SparkIcon />
      </motion.div>

      {/* The mother container shrinking will natively wipe this text via overflow-hidden */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-md font-['Outfit'] font-light text-white whitespace-nowrap"
      >
        Learn together
      </motion.span>
    </motion.button>
  );
}

/* ─────────────── State 2: Collapsed Orb (Spark only) ─────────────── */
function CollapsedOrb() {
  return (
    <motion.div
      layoutId="widget-container"
      style={{ borderRadius: 32 }}
      className="flex h-14 w-14 items-center justify-center bg-stone-950 p-4"
    >
      <motion.div layoutId="widget-icon">
        <SparkIcon isactive={true} />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── State 3: Width Expansion (Spark + Ask me anything) ─────────────── */
function InputBar() {
  return (
    <motion.div
      layoutId="widget-container"
      style={{ borderRadius: 32 }}
      className="flex h-14 w-[388px] items-center gap-4 overflow-hidden bg-stone-950 px-5 shadow-2xl"
    >
      <motion.div layoutId="widget-icon">
        <SparkIcon isactive={false} />
      </motion.div>

      {/* "Ask me anything" reveals as width expands */}
      <motion.input
        layoutId="widget-input"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        readOnly
        placeholder="Ask me anything"
        className="flex-1 text-sm bg-transparent outline-none text-white placeholder:text-white/50 overflow-hidden"
      />
    </motion.div>
  );
}

/* ─────────────── State 4: Height Expansion (Full Chat) ─────────────── */
function ChatWindow({ onClose }: { onClose: (e?: React.MouseEvent) => void }) {
  return (
    <motion.div
      layoutId="widget-container"
      transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
      className="relative w-[388px] h-[640px] overflow-hidden bg-stone-950 shadow-2xl"
      style={{ borderRadius: 24 }}
    >
      {/* Background Video */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="absolute inset-0 z-0"
      >
        <video
          className="absolute inset-0 z-0 w-full h-full object-cover scale-90"
          src="/videos/aiChatVideo.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-[344px] z-10 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent pointer-events-none" />
      </motion.div>
      {/* Container for content */}
      <div className="relative z-20 flex h-full flex-col">
        {/* Header - Fades in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="px-4 pt-3 flex items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs font-light">
              Let&apos;s talk us
            </span>
            <span className="size-1.5 rounded-full bg-lime-400" />
            <span className="text-white text-xs font-light">Online</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="ml-auto flex items-center justify-center size-8 bg-stone-800 rounded-full hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <Image src={XIcon} alt="Close" width={16} height={16} />
          </button>
        </motion.div>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col gap-8 pb-5">
          {/* Welcome text - Fades in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4, ease: easeIn }}
            className="flex flex-col gap-3 px-5"
          >
            <p className="text-xs text-gray-200/70">Let&apos;s talk us!</p>
            <h2 className="text-lg leading-5 text-gray-200 font-light">
              Hey there! We&apos;re so glad you&apos;re here. Let&apos;s jump
              into our chat and share some fun?
            </h2>
          </motion.div>

          {/* Input Area - PERSISTS AND MORPHS WITHOUT FADING */}
          <div className="flex items-center gap-4 px-5">
            <motion.div layoutId="widget-icon">
              <SparkIcon isactive={false} />
            </motion.div>
            <motion.input
              layoutId="widget-input"
              type="text"
              placeholder="Ask me anything"
              className="flex-1 text-sm bg-transparent outline-none text-white placeholder:text-white/50"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
