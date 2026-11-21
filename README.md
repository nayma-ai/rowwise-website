# Rowwise website

Static site for rowwise.dev. No build step or framework is required.

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. `index.html`, `styles.css` and `script.js` contain the landing page. The logo is synchronized with the desktop app’s Branding v2 selected-row mark; colors follow its graphite/acid palette, with a darker accent for readable text in light mode. Geist is used for UI and Geist Mono for the wordmark and code.

Product previews are clearly labelled illustrative sample data, not screenshots or a live database. Their tab controls support arrow keys, Home and End. Themes follow the device until a choice is saved. Source search and categories combine; all sources remain available without JavaScript. MCP command copying has a manual-selection fallback.

## Content status

The 19 engine connectors match the desktop `sources.ts` catalog at beta.9. libSQL/Turso, Elasticsearch, OpenSearch, Redshift, Databricks and Trino remain read-only Preview. DynamoDB read-only is qualified on macOS and remains Preview on Windows/Linux. Neon and Supabase connect through PostgreSQL. Local file formats share the same source grid and have a Files filter. These labels must follow app qualification, not merely the existence of a connector.

Built-in AI uses schema context without result rows. MCP returns query data to the connected client; that client may send it to its provider. The local MCP server is off on launch and read-only by default.

The macOS download points to the signed universal OCI stable installer. Windows/Linux are explicitly Preview; no installer links are advertised until public Preview builds are available. Personal/Pro purchase buttons use NAYMA Billing when its approved HTTPS origin is set in `billing-config.js`. Until then they link to the Mac trial and make the closed checkout explicit. The current launch prices are $49 Personal (two devices) and $69 Pro (five devices). Purchases through 31 December 2026 include perpetual access and lifetime updates. Regular prices are $79/$99; purchases from 1 January 2027 include 12 months of updates and perpetual use of eligible releases. Existing launch buyers retain lifetime coverage.

This change does not publish the site, alter release artifacts, or change GitHub Actions billing.

## Verification

Reviewed in light and dark themes at desktop and mobile breakpoints (1280px, 932px, 390px and 320px), with no page overflow. Checked preview keyboard navigation, supporting SQL, combined source category/search filters, empty-state recovery, MCP command copying, theme persistence, mobile menu/Escape and section navigation. The catalog and logo match the app. Local assets, SVGs, anchor IDs, sample chart values, JavaScript syntax and formatting checks pass.

The macOS installer and live beta.9 manifest were verified. The previous Windows installer URL returned 404 and has been removed; Windows/Linux status remains Preview. No live website publication or Actions billing change was made.

Source cards now use the original brand artwork with consistent image frames and independent status badges. Source snapshots and checksums are recorded in `assets/db/source-provenance.json`; image URLs include a content hash to avoid retaining the previous monochrome assets in browser caches. Logos are bundled locally and preserve their colors and proportions. Light/dark themes, 320px/390px mobile layouts, source filtering and unchanged qualification badges were verified.

CSV, Parquet, JSON/JSONL and Excel appear as compact cards within the source catalog, using the same search and filters. The catalog count distinguishes the 19 database connectors from local files. File cards show extensions; Excel support is XLSX. There is no separate file section, hero shortcut or expanded import tutorial.

## Checkout configuration

The public origin in `billing-config.js` points to production NAYMA Billing. Pricing buttons use the download links until the public plans endpoint reports `checkoutEnabled: true`. Once open, the website sends the selected plan alias to Billing and follows the verified production Polar URL. Keep provider credentials server-side. Refresh the script URL content hashes after edits. Run `node --test tests/*.test.mjs` to verify closed and unavailable checkout fallback, plan selection, and redirect validation.

## Buyer-focused content (26 October 2026)

The page now leads with a concrete data-to-answer outcome and four buying reasons: 19 database connectors plus local files, business Ask, AI-assisted SQL, and MCP for coding assistants. The product story runs from Ask to SQL review, MCP, source coverage, pricing and buyer FAQs. The SQL example and the hero Query tab show a plain-language request alongside its draft; the SQL preview link selects that tab and brings keyboard focus with it.

Both Personal and Pro include all features, perpetual use and 12 months of updates; device count is the difference. Unverified reference prices and the unimplemented annual Team offer were removed. Team inquiries use a compact contact link. Pricing buttons lead to the trial while billing-config.js has an empty origin. Production checkout remains closed, beta.9 stays the current Mac download, and Windows/Linux and connector qualification labels are preserved. No live publication, billing changes or release uploads are part of this work.

Local verification for this pass: all three checkout tests passed; JavaScript syntax, formatting, local asset paths and anchor targets passed. The source catalog still contains 19 database connectors and four file-format cards, with the six existing connector Preview badges retained. Browser checks at 320, 390, 932 and 1280px in both themes found no horizontal page overflow or broken images. Tested combined source search/filtering and empty recovery, mobile menu/Escape, preview arrow/Home keys, supporting SQL expansion, and the direct SQL link’s selected tab and focus. The Personal pricing CTA remained on the local trial section without creating a checkout. Browser console reported no warnings or errors. These are local usability checks, not conversion-rate measurements.

## Lifetime-update checkout contract

Personal remains US$49 for two devices and Pro US$69 for three devices, for one
person. The pricing cards and FAQ promise lifetime updates; older policy notes
above describe historical work. AI usage remains separately billed. Existing
buyers refresh their signed license once to obtain the new offline coverage.

The checkout script requires the exact two USD plans, device counts, perpetual
rights, `updates: "lifetime"` and `updateMonths: null` from Billing before
enabling purchase links. Old, missing, duplicated or mismatched metadata keeps
the download fallback. This prevents a partial deployment from selling an
unbacked lifetime promise. Deploy the scoped Billing change and update Polar
descriptions before publishing this PR. No app release or download change is
included; macOS stays at 1.0.4, Windows/Linux stay Preview and Actions stays US$0.

## macOS 1.0.5 — 21 November 2026

The release chip, platform FAQ and download footer identify 1.0.5. Publish this
version change only after the signed universal installer and updater are live
and verified. Stable OCI download links, launch pricing, source qualification
labels and Windows/Linux Preview remain unchanged. Actions stays US$0.
