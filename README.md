# Brave Spark Link Bio

Single-page React + Tailwind link-in-bio / portfolio site for Brave Spark, backed by Vercel Blob for live admin edits.

## Stack

- Vite, React, Tailwind CSS
- Vercel serverless API routes
- Vercel Blob for shared site settings, profile photo uploads, videos, posters, and the video manifest

## Environment Variables

Set these in Vercel for production, preview, and local development:

```bash
BLOB_READ_WRITE_TOKEN=...
ADMIN_PASSWORD=...
```

`ADMIN_PASSWORD` controls the protected admin panel and upload APIs. The password is intentionally not stored in source code.

## Local Development

```bash
npm install
npm run dev
```

For local API testing with Vercel routes, use `vercel dev` with the same environment variables.

## Admin Usage

1. Open the live site.
2. Click the footer fire emoji.
3. Enter the admin password from `ADMIN_PASSWORD`.
4. Use **Site Controls** to edit the account name, handle, tagline, bio, hero links, profile photo, video section copy, page title, and meta description.
5. Use the bio helper to check character count, paragraph count, and the exact rendered preview before saving.
6. Use **Video Slots** to add, delete, hide/show, drag reorder, edit titles, upload videos, and choose a poster frame.
7. Save each change and wait for the success toast before closing the tab.

## Blob Data

- Site settings: `brave-spark/site-settings.json`
- Video manifest: `brave-spark/videos.json`
- Video files and generated posters: stored as public Vercel Blob assets
- Profile photo uploads: stored as public Vercel Blob assets

## Deployment

```bash
npm run build
vercel --prod --yes --scope nachumweinstock-debugs-projects
```

The frontend reads settings from `/api/site-settings` and videos from `/api/videos`, so normal content changes made in the admin panel do not require a redeploy.
