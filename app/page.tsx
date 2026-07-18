import { tokens } from "../src/tokens/tokens";

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center font-sans"
      style={{ backgroundColor: tokens.color.grey, color: tokens.color.primary }}
    >
      <main
        className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-16 py-32 sm:items-start"
        style={{ backgroundColor: tokens.color.secondary }}
      >
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-8"
          style={{ backgroundColor: tokens.color.primary, color: tokens.color.secondary }}
        >
          <div
            className="mb-4 h-3 w-24 rounded-full"
            style={{ backgroundColor: tokens.color.green }}
          />
          <h1 className="text-3xl font-semibold">Hello there</h1>
          <p className="mt-2 text-sm" style={{ color: tokens.color.grey }}>
            Using design tokens for the page colors.
          </p>
        </div>
      </main>
    </div>
  );
}
