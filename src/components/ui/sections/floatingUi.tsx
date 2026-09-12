// components/FloatingUI.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MenuButton from "../buttons/menuButton";
import VideoButton from "../buttons/videoButton";
import PitchDeckModal from "../pitchDeckModal";

export default function FloatingUI() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isProfileStage, setIsProfileStage] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const closePitchDeck = useCallback(() => setIsPitchDeckOpen(false), []);

  useEffect(() => {
    const openContactMenu = () => setIsMenuOpen(true);

    window.addEventListener("portfolio:open-contact-menu", openContactMenu);
    return () =>
      window.removeEventListener("portfolio:open-contact-menu", openContactMenu);
  }, []);

  useEffect(() => {
    const updateProfileStage = (event: Event) => {
      const { active, projectIndex } = (
        event as CustomEvent<{ active: boolean; projectIndex?: number }>
      ).detail;
      setIsProfileStage(active);
      if (typeof projectIndex === "number") {
        setSelectedProjectIndex(projectIndex);
      }
      if (active) setIsMenuOpen(false);
    };

    window.addEventListener("portfolio:profile-stage", updateProfileStage);
    return () =>
      window.removeEventListener("portfolio:profile-stage", updateProfileStage);
  }, []);

  return (
    <>
      <div className="float-ui fixed inset-0 z-50 pointer-events-none">
        {/* Top Center — Primary Navigation */}
        <AnimatePresence initial={false}>
          {!isProfileStage ? (
            <motion.nav
              className="absolute left-1/2 top-4 w-[min(386px,calc(100vw-32px))] -translate-x-1/2 pointer-events-auto"
              aria-label="Primary navigation"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <MenuButton
                isOpen={isMenuOpen}
                onOpenChange={setIsMenuOpen}
                onPitchDeck={() => {
                  setIsMenuOpen(false);
                  setIsPitchDeckOpen(true);
                }}
              />
            </motion.nav>
          ) : null}
        </AnimatePresence>

        {/* Top Right — Pitch Deck */}
        <AnimatePresence initial={false}>
          {!isMenuOpen ? (
            <motion.div
              className="absolute right-4 top-20 pointer-events-auto xl:top-4"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <VideoButton
                showProjectState={isProfileStage}
                selectedProjectIndex={selectedProjectIndex}
                onProjectSelect={setSelectedProjectIndex}
                onClick={() => setIsPitchDeckOpen((open) => !open)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

      </div>
      <PitchDeckModal isOpen={isPitchDeckOpen} onClose={closePitchDeck} />
    </>
  );
}
