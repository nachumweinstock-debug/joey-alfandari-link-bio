# Brave Spark Link Bio

Single-page React + Tailwind link-in-bio / portfolio site for Brave Spark.

## Customize

- Replace `public/joey-profile.jpg` with Joey's real profile photo.
- Edit bio copy and links in `src/App.jsx`.
- Admin video editing: click the `@brave_spark_` badge, enter `3907`, choose Slot 1, 2, or 3, then edit the label/title and upload a video.
- Admin uploads are saved in that browser through IndexedDB. For the same videos to appear for every visitor/device, connect a backend storage service such as Vercel Blob or Supabase Storage.

## Run

```bash
npm install
npm run dev
```
