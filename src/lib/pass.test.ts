import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generatePassNumber, passName } from "./pass.ts";

describe("generatePassNumber", () => {
  it("a le format DM-XXX-XXX sans caractères ambigus", () => {
    for (let i = 0; i < 50; i += 1) {
      assert.match(generatePassNumber(), /^DM-[A-HJKMNP-Z2-9]{3}-[A-HJKMNP-Z2-9]{3}$/);
    }
  });
  it("ne répète pas toujours le même numéro", () => {
    const set = new Set(Array.from({ length: 30 }, () => generatePassNumber()));
    assert.ok(set.size > 20);
  });
});

describe("passName", () => {
  it("ne garde que le premier mot et limite la longueur", () => {
    assert.equal(passName("  Awa   Koné "), "Awa");
    assert.equal(passName("A".repeat(40)).length, 20);
    assert.equal(passName(""), "");
  });
});
