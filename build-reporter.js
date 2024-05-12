const { build } = require("esbuild");
const { polyfillNode } = require("esbuild-plugin-polyfill-node");

build({
  entryPoints: ["reporter.js"],
  bundle: true,
  outfile: "dist/reporter.js",
  plugins: [
    polyfillNode(),
  ],
});
