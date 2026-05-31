# Brave Spark Link Bio

Single-page React + Tailwind link-in-bio / portfolio site for Brave Spark. Videos are embedded from external platforms instead of being hosted by the site.

## Stack

- Vite, React, Tailwind CSS
- Vercel serverless API routes
- GitHub Contents API for small editable JSON data
- Instagram Reel embeds, with fallback support for other public video URLs

## Environment Variables

Set these in Vercel for production, preview, and local development:

```bash
ADMIN_PASSWORD=...
GITHUB_TOKEN=...
GITHUB_REPO=nachumweinstock-debug/joey-alfandari-link-bio
GITHUB_DATA_BRANCH=main
```

`ADMIN_PASSWORD` controls the protected admin panel and save APIs. The password is intentionally not stored in source code.
`GITHUB_TOKEN` needs repo contents read/write access. `GITHUB_REPO` and `GITHUB_DATA_BRANCH` are optional if Vercel's Git metadata points at the correct repo and branch.

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
4. Use **Site Controls** to edit the account name, handle, tagline, bio, hero links, profile photo URL, video section copy, page title, and meta description.
5. Use the bio helper to check character count, paragraph count, and the exact rendered preview before saving.
6. Use **Videos** to add, delete, hide/show, drag reorder, edit titles, and paste Instagram Reel links.
7. Save each change and wait for the success toast before closing the tab.

## GitHub Data

- Site settings: `data/site-settings.json`
- Video manifest: `data/videos-manifest.json`
- Media files are not stored in this repo or in Vercel.

## Deployment

```bash
npm run build
vercel --prod --yes --scope nachumweinstock-debugs-projects
```

The frontend reads settings from `/api/site-settings` and videos from `/api/videos`, so normal content changes made in the admin panel do not require a redeploy.
