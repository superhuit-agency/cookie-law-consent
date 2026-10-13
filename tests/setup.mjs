/**
 * Lets Node's test runner import the front-end sources the way webpack does:
 * extensionless relative imports, `.scss` imports and plain `.json` imports.
 */
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

registerHooks({
	resolve(specifier, context, nextResolve) {
		try {
			return nextResolve(specifier, context);
		} catch (error) {
			if (error.code !== "ERR_MODULE_NOT_FOUND" || !specifier.startsWith("."))
				throw error;
			return nextResolve(`${specifier}.js`, context);
		}
	},
	load(url, context, nextLoad) {
		if (url.endsWith(".scss"))
			return { format: "module", source: "export default {};", shortCircuit: true };

		if (url.endsWith(".json"))
			return {
				format: "module",
				source: `export default ${readFileSync(fileURLToPath(url), "utf8")};`,
				shortCircuit: true,
			};

		if (url.includes("/src/") && url.endsWith(".js"))
			return nextLoad(url, { ...context, format: "module" });

		return nextLoad(url, context);
	},
});
