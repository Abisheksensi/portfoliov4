"use client";

import SparkIcon from "./sparkIcon";

interface CTAButtonProps {
  readonly text?: string;
  readonly onClick?: () => void;
}

export default function CTAButton({
  text = "Learn together",
  onClick,
}: Readonly<CTAButtonProps>) {
  return (
    <button
      onClick={onClick}
      className="
        group
        inline-flex
        items-center
        gap-8
        rounded-full
        bg-stone-950
        px-4
        py-4
        transition-all
        duration-300
        hover:bg-neutral-900
        active:scale-95
      "
    >
      <SparkIcon />

      <span
        className="
          text-lg
          font-light
          text-gray-200
          font-[Outfit]
          whitespace-nowrap
        "
      >
        {text}
      </span>
    </button>
  );
}