import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
const source = fs.readFileSync(
  new URL("../checkout.js", import.meta.url),
  "utf8",
);
async function setup(
  origin,
  fetcher,
  catalog = async () => ({
    ok: true,
    json: async () => ({ checkoutEnabled: true }),
  }),
) {
  const redirects = [];
  const listeners = [];
  const attrs = new Map();
  const label = { textContent: "Try before buying" };
  const open = { hidden: true };
  const closed = { hidden: false };
  const catalogRequests = [];
  const link = {
    querySelector: () => label,
    dataset: { checkoutPlan: "three" },
    addEventListener: (name, fn) => listeners.push(fn),
    getAttribute: (k) => attrs.get(k),
    setAttribute: (k, v) => attrs.set(k, v),
    removeAttribute: (k) => attrs.delete(k),
  };
  const status = { textContent: "" };
  await vm.runInNewContext(source, {
    window: {
      ROWWISE_BILLING_ORIGIN: origin,
      location: { assign: (v) => redirects.push(v) },
    },
    document: {
      getElementById: () => status,
      querySelectorAll: (selector) =>
        ({
          "[data-checkout-open]": [open],
          "[data-checkout-closed]": [closed],
          "[data-checkout-plan]": [link],
        })[selector],
    },
    URL,
    AbortSignal,
    fetch: (url, options) => {
      if (options.method === "POST") return fetcher(url, options);
      catalogRequests.push(url);
      return catalog();
    },
  });
  return {
    redirects,
    listeners,
    attrs,
    status,
    label,
    open,
    closed,
    catalogRequests,
  };
}
test("unconfigured or invalid origins keep the download fallback", async () => {
  for (const origin of [
    "",
    "http://billing.example.com",
    "https://billing.example.com/path",
  ]) {
    const c = await setup(origin, () => assert.fail());
    assert.equal(c.listeners.length, 0);
    assert.equal(c.catalogRequests.length, 0);
  }
});
test("closed or unavailable Billing keeps the download links and launch copy", async () => {
  const origin = "https://billing.example.com";
  for (const catalog of [
    async () => ({ ok: true, json: async () => ({ checkoutEnabled: false }) }),
    async () => ({ ok: true, json: async () => ({ checkoutEnabled: "true" }) }),
    async () => ({ ok: false }),
    async () => {
      throw Error("offline");
    },
  ]) {
    const c = await setup(
      origin,
      () => assert.fail("unexpected checkout"),
      catalog,
    );
    assert.deepEqual(c.catalogRequests, [
      origin + "/v1/products/rowwise/plans",
    ]);
    assert.equal(c.listeners.length, 0);
    assert.equal(c.label.textContent, "Try before buying");
    assert.equal(c.open.hidden, true);
    assert.equal(c.closed.hidden, false);
  }
});
test("checkout sends only the selected plan and follows a verified Polar URL", async () => {
  let input;
  const c = await setup("https://billing.example.com", async (url, options) => {
    input = { url, options };
    return {
      ok: true,
      json: async () => ({ url: "https://polar.sh/checkout/abc" }),
    };
  });
  assert.equal(c.label.textContent, "Buy Pro");
  assert.equal(c.open.hidden, false);
  assert.equal(c.closed.hidden, true);
  await c.listeners[0]({ preventDefault() {} });
  assert.equal(input.url, "https://billing.example.com/v1/checkout/sessions");
  assert.deepEqual(JSON.parse(input.options.body), { planId: "three" });
  assert.deepEqual(c.redirects, ["https://polar.sh/checkout/abc"]);
  assert.equal(c.attrs.has("aria-busy"), false);
});
test("failed or untrusted checkout responses remain on the website and permit retry", async () => {
  const c = await setup("https://billing.example.com", async () => ({
    ok: true,
    json: async () => ({ url: "https://evil.example.com" }),
  }));
  await c.listeners[0]({ preventDefault() {} });
  assert.equal(c.redirects.length, 0);
  assert.match(c.status.textContent, /temporarily unavailable/);
  assert.equal(c.attrs.has("aria-busy"), false);
});
