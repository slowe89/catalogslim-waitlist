# CatalogSlim

Demand-test waitlist for **CatalogSlim** — a CI confusion-pair gate and always-on shortlist diet so selection stops picking the wrong sibling tool. Outside SOLVD. Static Vite site: landing copy, client-side Catalog Readiness Score, and a waitlist form. No product backend, checkout, or cart.

Capture: **thespencerlowe@gmail.com**

Meta title: `CatalogSlim — stop agents picking the wrong sibling tool`

This is a demand test. CatalogSlim works alongside existing tool search: when recall finds the right cluster but selection still picks `crm.patch` over `crm.write`, or a named connector over an opaque UUID for the same product, ship a confusion-pair assertion and a short always-on shortlist — not a longer catalog.

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

Hidden fields on submit: `_subject` (`CatalogSlim waitlist`), `_honey`, `source` (`catalogslim-scorecard` or `catalogslim-waitlist`), `score_total`, `score_vector` (Y/N), `timestamp`, and `scorecard_version` (`catalogslim-connector-id-2026-09-23`). Q3 asks whether sibling MCP servers use stable connector IDs so a display name can’t collide.

## What’s on the page

- Landing copy (wrong-sibling H1, CI shortlist pack, who for / who not, early pricing)
- 10-item Catalog Readiness Score (Yes = 10, No = 0; bands 0–100: Baseline not established / Some checks covered / Most checks covered / Checklist largely covered)
- Waitlist form (required email + Q1–Q5 + budget bands Under $500 / $500–$1,999 / $2,000–$3,999 / $4,000–$9,999 / $10,000+ / Not sure yet)

This is a waitlist / score follow-up page only. No invented metrics or waitlist counts.

## Preview

Named connector vs opaque UUID, on top of the wrong-sibling / CI shortlist copy:

- [docs/named-vs-uuid/hero_desktop.png](docs/named-vs-uuid/hero_desktop.png) — hero example (desktop 1280×800)
- [docs/named-vs-uuid/hero_mobile_375.png](docs/named-vs-uuid/hero_mobile_375.png) — hero example (~375px)
- [docs/named-vs-uuid/pack_desktop.png](docs/named-vs-uuid/pack_desktop.png) — pack bullet (desktop)
- [docs/named-vs-uuid/pack_mobile_375.png](docs/named-vs-uuid/pack_mobile_375.png) — pack bullet (~375px)
- [docs/named-vs-uuid/scorecard_q3_desktop.png](docs/named-vs-uuid/scorecard_q3_desktop.png) — scorecard Q3, all Yes = 100 (desktop)
- [docs/named-vs-uuid/scorecard_q3_mobile_375.png](docs/named-vs-uuid/scorecard_q3_mobile_375.png) — scorecard Q3 (~375px)

Earlier wrong-sibling / CI shortlist shots:

- [docs/sibling-copy/hero_desktop.png](docs/sibling-copy/hero_desktop.png) — hero + pack (desktop 1280×800)
- [docs/sibling-copy/hero_mobile_375.png](docs/sibling-copy/hero_mobile_375.png) — hero (~375px)
- [docs/sibling-copy/pack_mobile_375.png](docs/sibling-copy/pack_mobile_375.png) — pack (~375px)

Earlier polish QA shots of the polished page:

- [docs/polish-qa/hero-desktop.png](docs/polish-qa/hero-desktop.png) — hero (desktop)
- [docs/polish-qa/hero-mobile.png](docs/polish-qa/hero-mobile.png) — hero (mobile)
- [docs/polish-qa/scorecard-completed.png](docs/polish-qa/scorecard-completed.png) — completed Catalog Readiness Score
- [docs/polish-qa/form.png](docs/polish-qa/form.png) — waitlist form
- [docs/polish-qa/form-budget.png](docs/polish-qa/form-budget.png) — budget bands
- [docs/polish-qa/success-state.png](docs/polish-qa/success-state.png) — intercepted success state
- [docs/polish-qa/pricing-mobile.png](docs/polish-qa/pricing-mobile.png) — stacked early pricing on a phone
