import { defineConfig } from "vite"
import { fileURLToPath } from "node:url"

export default defineConfig({
  build: {
    target: "esnext",
  },
  resolve: {
    alias: [
      {
        find: "$assets",
        replacement: fileURLToPath(new URL("./src/assets", import.meta.url)),
      },
    ],
  },
})
