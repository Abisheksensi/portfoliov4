"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FloatingUI from "../src/components/ui/sections/floatingUi";

const pageEase = [0.22, 1, 0.36, 1] as const;

export default function SiteShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [isPageCollapsing, setIsPageCollapsing] = useState(false);

  useEffect(() => {
    const arrivalTimer = window.setTimeout(() => {
      setIsPageCollapsing(false);
    }, 0);

    return () => window.clearTimeout(arrivalTimer);
  }, [pathname]);

  const transitionDuration = shouldReduceMotion ? 0.01 : 0.62;

  return (
    <>
      <motion.div
        key={pathname}
        className="min-h-[var(--viewport-height)] origin-top"
        initial={
          pathname === "/contact" && !shouldReduceMotion
            ? {
                opacity: 0,
                y: 22,
                scale: 0.985,
                filter: "blur(18px)",
              }
            : false
        }
        animate={
          isPageCollapsing
            ? {
                opacity: 0,
                y: -18,
                scale: 0.94,
                filter: "blur(22px)",
                borderRadius: 32,
              }
            : {
                opacity: 1,
                y: 0,
                scale: 1,
                // Even blur(0px) creates a containing block for the fixed
                // ScrollTrigger stage. Restore viewport-based pinning at rest.
                filter: "none",
                borderRadius: 0,
              }
        }
        transition={{
          duration: transitionDuration,
          ease: pageEase,
        }}
      >
        {children}
      </motion.div>

      <FloatingUI
        onContactTransitionStart={() => setIsPageCollapsing(true)}
      />
    </>
  );
}
