import { randomBytes, scryptSync } from "node:crypto";

if (!process.stdin.isTTY) throw new Error("Run this command in an interactive terminal.");
process.stdout.write("New project password (at least 16 characters; input hidden): ");
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");
let password = "";
process.stdin.on("data", (input) => {
  if (input.includes("\u0003")) {
    process.stdin.setRawMode(false);
    process.stdout.write("\nCancelled.\n");
    process.exit(1);
  }
  for (const char of input) {
    if (char === "\r" || char === "\n") {
      if (password.length < 16 || password.length > 256) {
        password = "";
        process.stdout.write("\nPlease enter 16–256 characters: ");
        return;
      }
      const salt = randomBytes(16).toString("hex");
      const hash = scryptSync(password, salt, 64).toString("hex");
      process.stdin.setRawMode(false);
      process.stdout.write(`\nFORM_CHARLESTON_PASSWORD_HASH=scrypt:${salt}:${hash}\n`);
      process.exit(0);
    }
    if (char === "\u007f" || char === "\b") password = password.slice(0, -1);
    else if (char >= " ") password += char;
  }
});
