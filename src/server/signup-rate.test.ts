import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hashIp, ipHashSecret, pickClientIp, SignupConfigError } from "./signup-rate.server.ts";

const headers = (map: Record<string, string>) => ({ get: (name: string) => map[name] ?? null });

describe("hashIp", () => {
  it("est stable pour un même secret et change avec le secret", () => {
    assert.equal(hashIp("1.2.3.4", "a"), hashIp("1.2.3.4", "a"));
    assert.notEqual(hashIp("1.2.3.4", "a"), hashIp("1.2.3.4", "b"));
    assert.notEqual(hashIp("1.2.3.4", "a"), hashIp("1.2.3.5", "a"));
  });
});

describe("pickClientIp", () => {
  it("préfère x-real-ip, puis le premier x-forwarded-for, sinon null", () => {
    assert.equal(pickClientIp(headers({ "x-real-ip": "9.9.9.9", "x-forwarded-for": "1.1.1.1" })), "9.9.9.9");
    assert.equal(pickClientIp(headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" })), "1.1.1.1");
    assert.equal(pickClientIp(headers({})), null);
  });
});

describe("ipHashSecret", () => {
  it("est obligatoire en production", () => {
    assert.throws(() => ipHashSecret({ NODE_ENV: "production" }), SignupConfigError);
    assert.equal(ipHashSecret({ NODE_ENV: "production", IP_HASH_SECRET: " s3cret " }), "s3cret");
  });
  it("a un repli hors production", () => {
    assert.equal(typeof ipHashSecret({ NODE_ENV: "development" }), "string");
  });
});
