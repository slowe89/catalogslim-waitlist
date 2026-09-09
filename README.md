# CatalogSlim

Demand-test waitlist for **CatalogSlim** — catalog audits that help agents choose the right tool. Outside SOLVD. Static Vite site: landing copy, client-side Catalog Readiness Score, and a waitlist form. No product backend, checkout, or cart.

Capture: **thespencerlowe@gmail.com**

Meta title: `CatalogSlim — help your agents choose the right tool`

This is a demand test. CatalogSlim works alongside existing tool search: find overlapping names, clarify descriptions, and keep a shortlist of 3–5 tools loaded.

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

Hidden fields on submit: `_subject` (`CatalogSlim waitlist`), `_honey`, `source` (`catalogslim-scorecard` or `catalogslim-waitlist`), `score_total`, `score_vector` (Y/N), `timestamp`, and `scorecard_version` (`catalogslim-polish-2026-09-09`).

## What’s on the page

- Landing copy (headline, pack, who for / who not, early pricing)
- 10-item Catalog Readiness Score (Yes = 10, No = 0; bands 0–100: Baseline not established / Some checks covered / Most checks covered / Checklist largely covered)
- Waitlist form (required email + Q1–Q5 + budget bands Under $500 / $500–$1,999 / $2,000–$3,999 / $4,000–$9,999 / $10,000+ / Not sure yet)

This is a waitlist / score follow-up page only. No invented metrics or waitlist counts.

## Preview

Browser-verified shots of the polished page:

- [docs/polish-qa/hero-desktop.png](docs/polish-qa/hero-desktop.png) — hero (desktop)
- [docs/polish-qa/hero-mobile.png](docs/polish-qa/hero-mobile.png) — hero (mobile)
- [docs/polish-qa/scorecard-completed.png](docs/polish-qa/scorecard-completed.png) — completed Catalog Readiness Score
- [docs/polish-qa/form.png](docs/polish-qa/form.png) — waitlist form
- [docs/polish-qa/success-state.png](docs/polish-qa/success-state.png) — intercepted success state
