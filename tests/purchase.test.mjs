import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const source = readFileSync(new URL("../purchase.js", import.meta.url), "utf8");
async function run(hash, respond) {
  const heading = { textContent: "Your Rowwise purchase" };
  const status = { textContent: "Check your purchase email" };
  const events = [];
  await vm.runInNewContext(source, {
    URL,
    URLSearchParams,
    AbortSignal,
    location: { hash, pathname: "/purchase.html" },
    history: {
      replaceState: (_, __, path) => events.push(["strip", path]),
    },
    document: {
      getElementById: (id) => (id === "purchase-heading" ? heading : status),
    },
    window: { ROWWISE_BILLING_ORIGIN: "https://billing.example.com" },
    fetch: async (url, options) => {
      events.push(["fetch", url, JSON.parse(options.body)]);
      assert.equal(options.redirect, "error");
      assert.equal(options.credentials, "omit");
      return respond();
    },
  });
  return { heading, status, events };
}
test("the purchase page removes the private fragment before confirming payment", async () => {
  const page = await run("#session=one&token=two", () => ({
    ok: true,
    json: async () => ({ state: "paid" }),
  }));
  assert.deepEqual(page.events, [
    ["strip", "/purchase.html"],
    [
      "fetch",
      "https://billing.example.com/v1/checkout/status",
      { sessionId: "one", token: "two" },
    ],
  ]);
  assert.equal(page.heading.textContent, "Purchase confirmed");
  assert.match(page.status.textContent, /Check your email/);
});
test("missing, expired or unavailable status keeps the purchase recovery instructions available", async () => {
  const noSession = await run("", () => assert.fail());
  assert.equal(noSession.events.length, 0);
  const expired = await run("#session=one&token=two", () => ({
    ok: true,
    json: async () => ({ state: "expired" }),
  }));
  assert.match(expired.status.textContent, /expired/);
  const unavailable = await run("#session=one&token=two", () => ({
    ok: false,
  }));
  assert.match(unavailable.status.textContent, /email or purchase portal/);
});
