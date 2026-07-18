import { tokens } from "../src/tokens/tokens";

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center font-sans"
      style={{ backgroundColor: tokens.primitives.colors.grey, color: tokens.primitives.colors.dark }}
    >
      <main
        className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-32 sm:items-start"
        style={{ backgroundColor: tokens.primitives.colors.light }}
      >
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-8"
          style={{ backgroundColor: tokens.primitives.colors.dark, color: tokens.primitives.colors.light }}
        >
          <div
            className="mb-4 h-3 w-24 rounded-full"
            style={{ backgroundColor: tokens.primitives.colors.limegreen }}
          />
          <h1 className="text-3xl font-semibold">Hello there</h1>
          <p className="mt-2 text-sm" style={{ color: tokens.primitives.colors.grey }}>
            Using design tokens for the page colors.
          </p>
        </div>
      </main>
    </div>
  );
}
