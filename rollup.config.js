import { babel } from "@rollup/plugin-babel";
import { mkdir, readFile, writeFile } from "fs/promises";
import copy from "rollup-plugin-copy";
import multiEntry from "rollup-plugin-multi-entry";

const pkg = JSON.parse(
  await readFile(new URL("./package.json", import.meta.url)),
);

function createCommonJsPackage() {
  const pkgContent = { type: "commonjs" };
  return {
    name: "cjs-package",
    buildEnd: async () => {
      await mkdir("./dist/cjs", { recursive: true });
      await writeFile(
        "./dist/cjs/package.json",
        JSON.stringify(pkgContent, null, 2),
      );
    },
  };
}

export default [
  {
    input: {
      include: ["*.js"],
      exclude: ["rollup.config.js", "dist/**"],
    },
    external: [...Object.keys(pkg.dependencies)],
    plugins: [
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: ["@babel/preset-env"],
      }),
      multiEntry(),
      copy({
        targets: [
          {
            src: "./package.json",
            dest: "dist",
          },
        ],
      }),
      createCommonJsPackage(),
    ],
    output: [
      {
        exports: "named",
        format: "es",
        dir: "dist/esm/",
        preserveModules: true,
      },
      {
        exports: "named",
        format: "cjs",
        dir: "dist/cjs/",
        preserveModules: true,
      },
    ],
  },
];
