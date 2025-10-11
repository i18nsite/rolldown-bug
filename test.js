#!/usr/bin/env bun

import { rolldown } from "rolldown";
import read from "@3-/read";
import write from "@3-/write";
import { copyFileSync } from 'node:fs'

const treeshake = async (input, manualPureFunctions) => {
  const {
    output: [{ code }],
  } = await (
    await rolldown({
      input,
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
  });
  // , src = read(input)
  // if (code !== src) {
  //   write(input, code)
  //   return treeshake(input)
  // }
  return code;
};

const t1 = await treeshake("tree_shaking_decode.js");
console.log(
  "# first time treeshake : " + t1.length + " bytes\n\n```\n" + t1 + "\n```\n",
);

write("t1.js", t1);
const t2 = await treeshake("t1.js");
console.log(
  "# second time treeshake : " + t2.length + " bytes\n\n```\n" + t2 + "\n```\n",
);

const pure = ["$", "get", "liDecode", "decodeInt64Based", "v0_0", "v0", "set_"];
const t3 = await treeshake("t1.js", pure);
console.log(
  "# treeshake with manualPureFunctions : " +
  t3.length +
  " bytes\n\n```\n" +
  t3 +
  "\n```\n",
);

copyFileSync("tree_shaking_decode.js", "autopass.js");
let n = 0;
let size = Infinity
while (1) {
  const code = read("autopass.js");
  const t4 = await treeshake("autopass.js", pure);
  if (t4.length < size) {
    size = t4.length
    console.log(
      "# auto pass round " +
      ++n +
      " : " + code.length + " -> " +
      t4.length +
      " bytes"
    );
    write("autopass.js", t4);
  } else {
    break;
  }
}
