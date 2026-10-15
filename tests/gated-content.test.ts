import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Target returns and terms must live only under lib/gated, never in the content that
// pre-built pages are made from.
describe("public content", () => {
  const files = readdirSync("content").filter((f) => f.endsWith(".json"));
  it.each(files)("%s carries no target return rates", (f) => {
    const text = readFileSync(`content/${f}`, "utf8");
    expect(text).not.toMatch(/\d+(\.\d+)?% p\.a\./);
    expect(text).not.toMatch(/"returns"|"maxLvr"/);
  });
});
