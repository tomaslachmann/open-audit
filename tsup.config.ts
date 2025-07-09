import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "!test/**/*", "!examples/**/*"],
  dts: true, // Generate .d.ts types
  format: ["esm", "cjs"], // Output both ESM and CommonJS
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    "pg",
    "mysql2",
    "mongodb",
    "better-sqlite3",
    "fs",
    "path", // Native modules
  ],
});
