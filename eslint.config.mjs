import next from "eslint-config-next";

const config = [
  ...next,
  { ignores: [".next/**", "node_modules/**", "lib/readiness/engine.ts", "docs/**"] },
];

export default config;
