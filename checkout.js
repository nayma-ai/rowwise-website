(() => {
  let origin;
  try {
    const url = new URL(window.ROWWISE_BILLING_ORIGIN);
    if (
      url.protocol !== "https:" ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    )
      return;
    origin = url.origin;
  } catch {
    return;
  }
  const status = document.getElementById("checkout-status");
  document.querySelectorAll("[data-checkout-plan]").forEach((link) => {
    const label = link.querySelector("[data-checkout-label]");
    if (label)
      label.textContent =
        link.dataset.checkoutPlan === "single" ? "Buy Personal" : "Buy Pro";
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      if (link.getAttribute("aria-busy") === "true") return;
      link.setAttribute("aria-busy", "true");
      if (status) {
        status.hidden = false;
        status.textContent = "Opening secure checkout…";
      }
      try {
        const response = await fetch(`${origin}/v1/checkout/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: link.dataset.checkoutPlan }),
          credentials: "omit",
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw Error();
        const checkout = await response.json();
        const url = new URL(checkout.url);
        if (
          url.protocol !== "https:" ||
          !["polar.sh", "sandbox.polar.sh"].includes(url.hostname) ||
          url.username ||
          url.password
        )
          throw Error();
        window.location.assign(url.toString());
      } catch {
        if (status)
          status.textContent =
            "Checkout is temporarily unavailable. Try again or contact support@nayma.ai.";
      } finally {
        link.removeAttribute("aria-busy");
      }
    });
  });
})();
