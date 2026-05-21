# Brave Spark Link Bio

Single-page React + Tailwind link-in-bio / portfolio site for Brave Spark.

## Customize

- Replace `public/joey-profile.jpg` with Joey's real profile photo.
- Edit bio copy and links in `src/App.jsx`.
- Admin video editing: click the footer fire emoji, enter `3907`, choose Slot 1, 2, or 3, then edit the label/title and upload a video.
- Live uploads use Vercel Blob through `/api/blob-upload` and `/api/videos`, so saved videos are shared with all visitors once `BLOB_READ_WRITE_TOKEN` is configured in Vercel.

## Run

```bash
npm install
npm run dev
```
