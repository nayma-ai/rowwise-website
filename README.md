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

The macOS download points to the signed universal OCI stable installer. Windows/Linux are explicitly Preview; no installer links are advertised until public Preview builds are available. Paid purchase buttons open a sales inquiry because the previous links were dummy checkout URLs. Existing prices and beta lifetime-update terms are preserved.

This change does not publish the site, alter release artifacts, or change GitHub Actions billing.

## Verification

Reviewed in light and dark themes at desktop and mobile breakpoints (1280px, 932px, 390px and 320px), with no page overflow. Checked preview keyboard navigation, supporting SQL, combined source category/search filters, empty-state recovery, MCP command copying, theme persistence, mobile menu/Escape and section navigation. The catalog and logo match the app. Local assets, SVGs, anchor IDs, sample chart values, JavaScript syntax and formatting checks pass.

The macOS installer and live beta.9 manifest were verified. The previous Windows installer URL returned 404 and has been removed; Windows/Linux status remains Preview. No live website publication or Actions billing change was made.

Source cards now use the original brand artwork with consistent image frames and independent status badges. Source snapshots and checksums are recorded in `assets/db/source-provenance.json`; image URLs include a content hash to avoid retaining the previous monochrome assets in browser caches. Logos are bundled locally and preserve their colors and proportions. Light/dark themes, 320px/390px mobile layouts, source filtering and unchanged qualification badges were verified.

CSV, Parquet, JSON/JSONL and Excel appear as compact cards within the source catalog, using the same search and filters. The catalog count distinguishes the 19 database connectors from local files. File cards show extensions; Excel support is XLSX. There is no separate file section, hero shortcut or expanded import tutorial.
