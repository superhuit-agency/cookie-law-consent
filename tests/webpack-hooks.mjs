/**
 * Module hooks letting Node import the front-end sources the way webpack
 * bundles them: extensionless relative imports, `.json` imports without an
 * import attribute, and `.scss` imports (stubbed out).
 *
 * Import this file before importing anything from src/.
 */
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

registerHooks({
	resolve(specifier, context, nextResolve) {
		try {
			return nextResolve(specifier, context);
		} catch (error) {
			if (!specifier.startsWith(".")) throw error;
			for (const suffix of [".js", "/index.js"]) {
				try {
					return nextResolve(specifier + suffix, context);
				} catch (e) {
					// Try the next suffix
				}
			}
			throw error;
		}
	},
	load(url, context, nextLoad) {
		if (url.endsWith(".scss")) {
			return { format: "module", source: "", shortCircuit: true };
		}
		if (url.endsWith(".json")) {
			const json = readFileSync(fileURLToPath(url), "utf8");
			return { format: "module", source: `export default ${json};`, shortCircuit: true };
		}
		if (url.includes("/src/") && url.endsWith(".js")) {
			return { ...nextLoad(url, { ...context, format: "module" }), format: "module" };
		}
		return nextLoad(url, context);
	},
});
