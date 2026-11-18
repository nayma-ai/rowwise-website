(async () => {
  const params = new URLSearchParams(location.hash.slice(1));
  if (location.hash) history.replaceState(null, "", location.pathname);
  const sessionId = params.get("session");
  const token = params.get("token");
  if (!sessionId || !token) return;

  const status = document.getElementById("purchase-status");
  const heading = document.getElementById("purchase-heading");
  status.textContent = "Confirming your purchase…";
  try {
    const billing = new URL(window.ROWWISE_BILLING_ORIGIN);
    if (
      billing.protocol !== "https:" ||
      billing.username ||
      billing.password ||
      billing.port ||
      billing.pathname !== "/" ||
      billing.search ||
      billing.hash
    )
      throw Error();

    for (let attempt = 0; attempt < 5; attempt++) {
      const response = await fetch(`${billing.origin}/v1/checkout/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, token }),
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw Error();
      const { state } = await response.json();
      if (state === "paid") {
        heading.textContent = "Purchase confirmed";
        status.textContent =
          "Check your email or open the Polar purchase portal to get your license key.";
        return;
      }
      if (state === "expired") {
        status.textContent =
          "This checkout expired. Return to Rowwise pricing to start again.";
        return;
      }
      if (state !== "pending") throw Error();
      if (attempt < 4)
        await new Promise((resolve) => setTimeout(resolve, 2500));
    }
  } catch {
    // The purchase email and the portal remain available if status cannot be read.
  }
  status.textContent =
    "We couldn’t confirm your purchase here. Check your email or purchase portal before trying again.";
})();
