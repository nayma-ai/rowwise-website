# Database logos

The 19 source connectors use locally bundled brand artwork rather than CSS masks. Logo colors and proportions are preserved; a 38px frame (34px on mobile) holds a 28px image (26px on mobile). Neutral light frames keep dark components readable in both themes. ClickHouse and Turso use dark frames for their original yellow and aqua artwork. No logo CDN requests are made at runtime.

## Artwork sources

- PostgreSQL, MySQL, MariaDB, SQL Server, SQLite, ClickHouse, DuckDB, MongoDB, Redis and Elasticsearch: original color artwork from Devicon, pinned at `6a37858047b0e8d9c9c0e68f4a071fc410652e89`. MIT license is included in `DEVICON-LICENSE`.
- DynamoDB and Redshift: service icons from AWS's `awslabs/aws-icons-for-plantuml`, pinned at `e26e2c05daf8b6bc4c764669fc2be04c314ccb8c`.
- OpenSearch: default brand mark from `opensearch-project/project-website`, pinned at `db813009479f1c23b5b156de7c564ebbad35be35`.
- Trino: official small mascot from `trinodb/trino.io`, pinned at `6e0f37c50c4aa25337a4799107e43de08a6a8645`.
- Databricks: official icon from `www.databricks.com/en-website-assets/icons/icon-192x192.png`.
- Turso: official aqua logomark from `https://turso.tech/logokit/turso-logomark-aqua.svg`, identifying the libSQL / Turso connection type.
- Snowflake: original blue symbol from `gilbarbara/logos`, pinned at `dafdf2df1334b2327497bfff40111aff0713c992`.
- BigQuery: the existing Simple Icons 16.33.0 artwork with its `#669DF6` brand fill restored. CC0 license remains in `SIMPLE-ICONS-LICENSE.md`.
- Oracle: the existing Devicon Oracle O glyph with its `#EA1B22` brand fill restored. Its viewport remains cropped to the O from the original wordmark; path geometry is unchanged.

Upstream license texts for the AWS icons, OpenSearch and SVG Logos collection are included in `licenses/`.

Exact URLs, source snapshots and SHA-256 checksums are recorded in `source-provenance.json`. Except for restoring BigQuery and Oracle fills, deployed image bytes match the downloaded originals. The generic data-file icon remains available for non-brand file references.

Product names and logos remain trademarks of their owners. Their use identifies compatible source types and does not imply endorsement. Preview and platform-qualification badges are separate text labels and are unchanged by this artwork update.
