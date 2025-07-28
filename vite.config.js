import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/js/ResponsiveTable.js"),
			name: "ResponsiveTable",
			fileName: () => `ResponsiveTable.js`,
			formats: ["iife"],
		},
		outDir: "public/js",
		emptyOutDir: true,
	},
});
