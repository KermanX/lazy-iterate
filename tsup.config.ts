import type { Options } from "tsup";

export const tsup: Options = {
  entry: ["src/*.ts"],
  format: ["cjs", "esm"],
  target: "es2019",
  dts: true,
  splitting: false,
};
