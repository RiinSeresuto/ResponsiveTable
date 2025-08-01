import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	build: {
		rollupOptions: {
			input: path.resolve(__dirname, "src/main.js"),
			output: {
				entryFileNames: "js/app.bundle.js",
				assetFileNames: (assetInfo) => {
					if (assetInfo.name && assetInfo.name.endsWith(".css")) {
						return "css/app.styles.css";
					}
					return "[name][extname]";
				},
			},
		},
		outDir: "public",
		emptyOutDir: true,
	},
});
