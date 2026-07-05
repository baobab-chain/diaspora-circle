# DiasporaCircle — Landing Page

A static landing page explaining the protocol. No build step required.

## Run locally

```bash
cd web
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just open `index.html` directly in a browser.

## Design notes

- The hero visual is a literal depiction of the rotation mechanic (member
  nodes cycling around a ring toward the pot) rather than generic crypto
  iconography — it auto-advances every ~2.6s and respects
  `prefers-reduced-motion`.
- Palette and type choices are documented at the top of `styles.css`.
- No frameworks or build tooling on purpose — this should stay trivial to
  deploy (GitHub Pages, Netlify, Vercel static hosting all work with zero
  config) and trivial for a first-time contributor to edit.

## Deploying to GitHub Pages

Settings → Pages → set source to the `web/` folder on `main` — no CI needed for this static version.
