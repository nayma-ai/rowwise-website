# File-format artwork

CSV, Parquet and JSON/JSONL use original, generic format illustrations drawn in the page's icon style. They are not vendor logos. Their extension labels remain visible beside the format names.

Excel uses the unchanged Microsoft Excel artwork from the SVGL collection, pinned at commit `f9b726cee1d1f3c697a18c880185e89d9a55bb70`:
https://raw.githubusercontent.com/pheralb/svgl/f9b726cee1d1f3c697a18c880185e89d9a55bb70/static/library/microsoft-excel.svg

The artwork is bundled locally, scaled with its original proportions and colors, and remains Microsoft's trademark. It identifies the supported XLSX file format; it does not imply an integration or endorsement. The image URL has a content hash for cache invalidation.

File support was checked against the desktop app's `fileImport.ts` and `FileImportPanel.vue`: CSV, Parquet, JSON, JSONL and XLSX, with read-only local snapshots. Legacy XLS files and formula recalculation are not advertised.
