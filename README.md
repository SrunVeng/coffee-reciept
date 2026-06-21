# Phin & Pour Staff Recipes

A lightweight recipe guide for coffee shop staff.

- English and Khmer interface and recipe content
- Category pictograms for quick recognition
- Drink prices
- Ingredient warehouse with dropdown selection
- Reusable preparations such as Egg Cream, Salted Cream, Coconut Slush, and Cold Brew Concentrate

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

Local recipes and warehouse ingredients are stored in `data/data.json`. It starts empty and the local Node server updates it whenever an item is created, edited, or deleted.

See `RECIPE_RESEARCH.md` for the source and calibration notes behind the starter menu.

The server listens on the local network, so staff devices on the same Wi-Fi can use the computer's local IP address with port `5173`.

Do not open `index.html` directly or run Vite by itself. The app needs `npm run dev` so `/api/data` can read and update `data/data.json`.

## Production

```bash
npm run build
npm start
```

## Deploy to Vercel

The deployed app uses Vercel Functions for `/api/*` and Vercel Blob for persistent recipe data. Vercel cannot permanently update the bundled `data/data.json` file.

1. Push this version of the project and import it into Vercel.
2. Open the project in the Vercel dashboard.
3. Open **Storage**, create a **Blob** store, and choose **Public** access.
4. Connect the Blob store to this project. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
5. Redeploy the project.

The first request creates an empty `current.json` Blob—or migrates the latest older Blob version when one exists. Later edits update that file with conflict protection. Production and preview deployments use separate data prefixes.

If the app says storage is not connected, confirm that the Blob integration added `BLOB_READ_WRITE_TOKEN` (or Vercel OIDC credentials with `BLOB_STORE_ID`) under **Project Settings → Environment Variables**, then redeploy.

The API is currently intended for a trusted staff deployment. Before exposing the URL publicly, add authentication or enable Vercel Deployment Protection so strangers cannot change recipes.

After deploying, open `/api/health` on your deployment domain. It reports only whether credentials exist, never their values. A correctly connected production deployment should show:

```json
{
  "storage": {
    "configured": true,
    "hasReadWriteToken": true,
    "environment": "production"
  }
}
```
