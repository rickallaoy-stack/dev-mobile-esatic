import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CHALLENGES, DEFAULT_CONFIG, matches, toCss, toDart } from "./layout-lab.ts";

describe("layout-lab", () => {
  it("génère le code Dart de la configuration", () => {
    const code = toDart({ parent: "Row", main: "spaceBetween", cross: "center", gap: 16, count: 2 });
    assert.match(code, /^Row\(/);
    assert.match(code, /MainAxisAlignment\.spaceBetween/);
    assert.match(code, /CrossAxisAlignment\.center/);
    assert.match(code, /spacing: 16,/);
    assert.equal((code.match(/Chip\(/g) ?? []).length, 2);
  });
  it("n'écrit pas spacing quand l'espace est nul", () => {
    assert.doesNotMatch(toDart(DEFAULT_CONFIG), /spacing/);
  });
  it("traduit en flexbox", () => {
    const css = toCss({ parent: "Column", main: "end", cross: "stretch", gap: 8, count: 3 });
    assert.equal(css.flexDirection, "column");
    assert.equal(css.justifyContent, "flex-end");
    assert.equal(css.alignItems, "stretch");
  });
  it("aucun défi n'est résolu au départ, et chacun a une solution", () => {
    for (const challenge of CHALLENGES) {
      assert.equal(matches(DEFAULT_CONFIG, challenge.target), false);
      assert.equal(matches({ ...DEFAULT_CONFIG, ...challenge.target }, challenge.target), true);
    }
  });
});
