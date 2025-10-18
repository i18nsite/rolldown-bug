#!/usr/bin/env bun

import { rolldown } from "rolldown"

const treeshake = async (input, manualPureFunctions) => {
	const {
		output: [{ code }],
	} = await (
		await rolldown({
			input,
			// external: ["@3-/write"],
			output: {
				minify: "dce-only",
			},
			treeshake: {
				preset: "smallest",
				unknownGlobalSideEffects: false,
				moduleSideEffects: false,
				manualPureFunctions,
			},
		})
	).generate({
		format: "esm",
		minify: {
			compress: {
				target: "esnext",
			},
			mangle: {
				toplevel: false,
			},
		},
	})
	return code
}

console.log(await treeshake("./main.js", []))
