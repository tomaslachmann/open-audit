import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

dotenv.config(); // 👈 loads .env at startup

export default defineConfig({
  test: {
    environment: "node",
  },
});
