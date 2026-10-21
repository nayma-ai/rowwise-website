import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
const source = fs.readFileSync(
  new URL("../checkout.js", import.meta.url),
  "utf8",
);
function setup(origin, fetcher) {
  const redirects = [];
  const listeners = [];
  const attrs = new Map();
  const link = {
    querySelector: () => ({ textContent: "" }),
    dataset: { checkoutPlan: "three" },
    addEventListener: (name, fn) => listeners.push(fn),
    getAttribute: (k) => attrs.get(k),
    setAttribute: (k, v) => attrs.set(k, v),
    removeAttribute: (k) => attrs.delete(k),
  };
  const status = { textContent: "" };
  vm.runInNewContext(source, {
    window: {
      ROWWISE_BILLING_ORIGIN: origin,
      location: { assign: (v) => redirects.push(v) },
    },
    document: { getElementById: () => status, querySelectorAll: () => [link] },
    URL,
    AbortSignal,
    fetch: fetcher,
  });
  return { redirects, listeners, attrs, status };
}
test("unconfigured or invalid origins keep the sales-contact fallback", () => {
  for (const origin of [
    "",
    "http://billing.example.com",
    "https://billing.example.com/path",
  ]) {
    const c = setup(origin, () => assert.fail());
    assert.equal(c.listeners.length, 0);
  }
});
test("checkout sends only the selected plan and follows a verified Polar URL", async () => {
  let input;
  const c = setup("https://billing.example.com", async (url, options) => {
    input = { url, options };
    return {
      ok: true,
      json: async () => ({ url: "https://polar.sh/checkout/abc" }),
    };
  });
  await c.listeners[0]({ preventDefault() {} });
  assert.equal(input.url, "https://billing.example.com/v1/checkout/sessions");
  assert.deepEqual(JSON.parse(input.options.body), { planId: "three" });
  assert.deepEqual(c.redirects, ["https://polar.sh/checkout/abc"]);
  assert.equal(c.attrs.has("aria-busy"), false);
});
test("failed or untrusted checkout responses remain on the website and permit retry", async () => {
  const c = setup("https://billing.example.com", async () => ({
    ok: true,
    json: async () => ({ url: "https://evil.example.com" }),
  }));
  await c.listeners[0]({ preventDefault() {} });
  assert.equal(c.redirects.length, 0);
  assert.match(c.status.textContent, /temporarily unavailable/);
  assert.equal(c.attrs.has("aria-busy"), false);
});
