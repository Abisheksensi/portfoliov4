// components/FloatingUI.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import MenuButton from "../buttons/menuButton";
import VideoButton from "../buttons/videoButton";
import PitchDeckModal from "../pitchDeckModal";

interface FloatingUIProps {
  readonly onContactTransitionStart?: () => void;
}

export default function FloatingUI({
  onContactTransitionStart,
}: FloatingUIProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isProfileStage, setIsProfileStage] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const selectedProjectIndexRef = useRef(0);
  const targetProjectIndexRef = useRef(0);
  const projectSequenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileEntryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProfileStageRef = useRef(false);
  const closePitchDeck = useCallback(() => setIsPitchDeckOpen(false), []);

  const selectProjectImmediately = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(3, index));
    if (projectSequenceTimeoutRef.current) {
      clearTimeout(projectSequenceTimeoutRef.current);
      projectSequenceTimeoutRef.current = null;
    }
    targetProjectIndexRef.current = nextIndex;
    selectedProjectIndexRef.current = nextIndex;
    setSelectedProjectIndex(nextIndex);
    window.dispatchEvent(
      new CustomEvent("portfolio:project-selection", {
        detail: { projectIndex: nextIndex },
      })
    );
  }, []);

  const queueProjectSelection = useCallback((index: number) => {
    targetProjectIndexRef.current = Math.max(0, Math.min(3, index));

    if (projectSequenceTimeoutRef.current) return;

    const advance = () => {
      const currentIndex = selectedProjectIndexRef.current;
      const targetIndex = targetProjectIndexRef.current;

      if (currentIndex === targetIndex) {
        projectSequenceTimeoutRef.current = null;
        return;
      }

      const nextIndex = currentIndex + Math.sign(targetIndex - currentIndex);
      selectedProjectIndexRef.current = nextIndex;
      setSelectedProjectIndex(nextIndex);
      window.dispatchEvent(
        new CustomEvent("portfolio:project-selection", {
          detail: { projectIndex: nextIndex },
        })
      );
      projectSequenceTimeoutRef.current = setTimeout(advance, 520);
    };

    advance();
  }, []);

  useEffect(() => {
    if (pathname === "/") return;

    const resetFrame = window.requestAnimationFrame(() => {
      isProfileStageRef.current = false;
      setIsProfileStage(false);
      selectProjectImmediately(0);
    });

    return () => window.cancelAnimationFrame(resetFrame);
  }, [pathname, selectProjectImmediately]);

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
        if (active && !isProfileStageRef.current) {
          isProfileStageRef.current = true;
          selectProjectImmediately(0);
          targetProjectIndexRef.current = Math.max(0, Math.min(3, projectIndex));
          profileEntryTimeoutRef.current = setTimeout(() => {
            profileEntryTimeoutRef.current = null;
            queueProjectSelection(targetProjectIndexRef.current);
          }, 1000);
        } else if (active && profileEntryTimeoutRef.current) {
          targetProjectIndexRef.current = Math.max(0, Math.min(3, projectIndex));
        } else if (active) {
          queueProjectSelection(projectIndex);
        } else {
          isProfileStageRef.current = false;
          if (profileEntryTimeoutRef.current) {
            clearTimeout(profileEntryTimeoutRef.current);
            profileEntryTimeoutRef.current = null;
          }
          selectProjectImmediately(0);
        }
      }
      if (active) setIsMenuOpen(false);
    };

    window.addEventListener("portfolio:profile-stage", updateProfileStage);
    return () =>
      {
        window.removeEventListener("portfolio:profile-stage", updateProfileStage);
        if (projectSequenceTimeoutRef.current) {
          clearTimeout(projectSequenceTimeoutRef.current);
          projectSequenceTimeoutRef.current = null;
        }
        if (profileEntryTimeoutRef.current) {
          clearTimeout(profileEntryTimeoutRef.current);
          profileEntryTimeoutRef.current = null;
        }
      };
  }, [queueProjectSelection, selectProjectImmediately]);

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
                onContactTransitionStart={onContactTransitionStart}
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
                onProjectSelect={selectProjectImmediately}
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
