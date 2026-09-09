# CatalogSlim

Priestley demand-test interest page for **CatalogSlim** — a catalog confusion diet for agent tool routing. Outside SOLVD. Static Vite site: landing copy, client-side Catalog Confusion Scorecard, and a waitlist form. No product backend, checkout, or cart.

Capture: **thespencerlowe@gmail.com**

Meta title: `CatalogSlim — catalog confusion diet for agent tool routing`

This is a demand test. Packaging is unproven. CatalogSlim is positioned as a **complement** to Anthropic Tool Search / `defer_loading` / RAG-MCP — search finds; diet disambiguates. Not a competing router SaaS.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

You can also open `index.html` after a build:

```bash
npm run build
npm run preview
```

`build` writes a static `dist/` you can host anywhere (including Vercel Hobby). `preview` serves that build locally.

## Form

The form’s default action is FormSubmit.co:

`https://formsubmit.co/thespencerlowe@gmail.com`

The first live submit sends FormSubmit an activation mail to that address. After you confirm it, later submissions arrive as email.

To point the same form at Formspree (or another endpoint) instead, copy `.env.example` to `.env` and set:

```bash
VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

Then rebuild. Leave it unset to keep FormSubmit → thespencerlowe@gmail.com.

Hidden fields on submit: `_subject` (`CatalogSlim waitlist`), `_honey`, `source` (`catalogslim-scorecard` or `catalogslim-waitlist`), `score_total`, `score_vector` (Y/N), and `timestamp`.

## What’s on the page

- Exact demand-test copy (headline, subhead, bullets, soft ranges, who / who not)
- 10-item Catalog Confusion Scorecard (Yes = 10, No = 0, bands 0–100: Flat dump / Partial diet / Fragile routing / Dieted + measured)
- Priestley form (required email + Q1–Q5 + budget bands Under $500 / $500–$1,999 / $2,000–$3,999 / $4,000–$9,999 / $10,000+ / Not sure yet)

This is a waitlist / score follow-up page only. No invented metrics, F1 lifts, or waitlist counts.

## Preview

Browser-verified shots of the shipped page:

- [docs/hero.png](docs/hero.png) — hero (desktop)
- [docs/scorecard.png](docs/scorecard.png) — Catalog Confusion Scorecard
- [docs/form.png](docs/form.png) — Priestley form
- [docs/hero-mobile.png](docs/hero-mobile.png) — mobile hero
