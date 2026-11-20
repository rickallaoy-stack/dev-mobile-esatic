import assert from "node:assert/strict";
import { test } from "node:test";
import { parseWhatsappUrl } from "./liens.ts";

test("parseWhatsappUrl : liens WhatsApp https valides", () => {
  assert.equal(parseWhatsappUrl("https://chat.whatsapp.com/AbC123"), "https://chat.whatsapp.com/AbC123");
  assert.equal(parseWhatsappUrl("  https://wa.me/2250102030405  "), "https://wa.me/2250102030405");
});

test("parseWhatsappUrl : tout le reste est refusé", () => {
  assert.equal(parseWhatsappUrl(undefined), null);
  assert.equal(parseWhatsappUrl(""), null);
  assert.equal(parseWhatsappUrl("http://chat.whatsapp.com/abc"), null);
  assert.equal(parseWhatsappUrl("https://chat.whatsapp.com/"), null);
  assert.equal(parseWhatsappUrl("https://evil.example/chat.whatsapp.com/abc"), null);
  assert.equal(parseWhatsappUrl("javascript:alert(1)"), null);
});
