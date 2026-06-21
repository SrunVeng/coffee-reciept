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

Recipes and warehouse ingredients are stored in `data/data.json`. The local Node server updates this file whenever a recipe or ingredient is created, edited, or deleted.

See `RECIPE_RESEARCH.md` for the source and calibration notes behind the starter menu.

The server listens on the local network, so staff devices on the same Wi-Fi can use the computer's local IP address with port `5173`.

Do not open `index.html` directly or run Vite by itself. The app needs `npm run dev` so `/api/data` can read and update `data/data.json`.

## Production

```bash
npm run build
npm start
```
