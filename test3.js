#!/usr/bin/env bun

import write from "@3-/write"
import read from "@3-/read"
import { rolldown } from "rolldown"
import { copyFileSync } from "node:fs"
import { join } from "node:path"

const GEN = join(import.meta.dirname, "gen")

const _treeshake = async (input, manualPureFunctions) => {
	const {
		output: [{ code }],
	} = await (
		await rolldown({
			input,
			output: {
				// minify: "dce-only",
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

const treeshake = async (input, manualPureFunctions, outfile) => {
	console.log("\n# " + outfile + "\n")
	outfile = join(GEN, outfile)
	copyFileSync(input, outfile)
	input = outfile

	let size = Infinity,
		code = read(input),
		n = 0
	for (;;) {
		const new_code = await _treeshake(input, manualPureFunctions)
		if (new_code.length < size) {
			const js_name = input.slice(0, -2) + ++n + ".js"
			console.log(n, code.length, "->", new_code.length, js_name)
			size = new_code.length
			code = new_code
			write(js_name, code)
			write(input, code)
		} else {
			write(input, code)
			return code
		}
	}
}

const file = join(GEN, "tree_shaking_decode.js")

await treeshake(file, [], "_no_manual.js")
await treeshake(file, ["getNum"], "_hasmanual.js")
