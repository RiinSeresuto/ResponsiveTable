import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	build: {
		rollupOptions: {
			input: path.resolve(__dirname, "src/main.js"), // Your main entry point
			output: {
				entryFileNames: "js/app.bundle.js",
				assetFileNames: (assetInfo) => {
					if (assetInfo.name && assetInfo.name.endsWith(".css")) {
						return "css/app.styles.css"; // Move CSS to /css
					}
					return "[name][extname]";
				},
			},
		},
		outDir: "public",
		emptyOutDir: true,
	},
});
