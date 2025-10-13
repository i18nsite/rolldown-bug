#!/usr/bin/env bun

import { rolldown } from "rolldown";

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
  return code;
};

const t1 = await treeshake("tree_shaking_decode.js");
console.log(
  "# first time treeshake : " + t1.length + " bytes",
);

const pure = ["set_"];
const t3 = await treeshake("tree_shaking_decode.js", pure);
console.log(
  "# treeshake with manualPureFunctions : " +
  t3.length
);
