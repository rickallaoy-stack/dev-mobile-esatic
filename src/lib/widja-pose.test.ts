import assert from "node:assert/strict";
import { test } from "node:test";
import { parseDawn, poseFromDawn } from "./widja-pose.ts";

test("parseDawn : valeurs absentes ou illisibles = nuit", () => {
  assert.equal(parseDawn(undefined), 0);
  assert.equal(parseDawn(""), 0);
  assert.equal(parseDawn("abc"), 0);
  assert.equal(parseDawn("0.250"), 0.25);
  assert.equal(parseDawn("7"), 1);
  assert.equal(parseDawn("-3"), 0);
});

test("poseFromDawn : jour = calme, nuit = chaotique", () => {
  assert.deepEqual(poseFromDawn(1), { chaos: 0, eye: "open", mouth: "soft", widget: "itclub" });
  assert.deepEqual(poseFromDawn(0), { chaos: 100, eye: "wild", mouth: "grin", widget: "code" });
  assert.equal(poseFromDawn(0.5).widget, "error");
  assert.equal(poseFromDawn(0.25).widget, "cracked");
});
