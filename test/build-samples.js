const { build } = require("esbuild");
const { polyfillNode } = require("esbuild-plugin-polyfill-node");
const { readdirSync } = require('fs');
const path = require("path");

const samples = readdirSync("test/samples").filter(s => s.endsWith(".js"));

build({
  entryPoints: samples.map(s => path.join("test/samples", s)),
  bundle: true,
  outdir: "test-samples-dist",
  allowOverwrite: true,
  plugins: [
    polyfillNode(),
  ],
});
