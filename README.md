# cybermango.ai

The Cyber Mango company website. Plain HTML, CSS and JavaScript with no build
step, published with GitHub Pages from the `main` branch.

| URL | File |
| --- | --- |
| `cybermango.ai/` | `index.html` — Cyber Mango company page |
| `cybermango.ai/omniguard` | `omniguard/index.html` — Omniguard landing page |
| any missing path | `404.html` |

Each page has its own look:

- **Cyber Mango** (`assets/cm.css`) — one flat mango colour, one headline, a
  list of apps. No scripts.
- **Omniguard** (`omniguard/og.css`, `omniguard/og.js`) — the green brand from
  the Shopify App Store listing, with an interactive price demo in the hero.

The icon and screenshots in `omniguard/img/` are the ones on the live listing
(https://apps.shopify.com/omniguard). Pricing, languages and feature copy on
the Omniguard page mirror that listing, so update both together.

## Publishing

Every push to `main` is live within a minute or two. `CNAME` sets the custom
domain and `.nojekyll` tells Pages to serve the files as they are.

Links use root-relative paths (`/omniguard`, `/assets/...`), so the site works
on the `cybermango.ai` domain but not under a `github.io/<repo>/` address.

## Preview locally

```shell
npx vite --port 4173
```

Then open http://localhost:4173 and http://localhost:4173/omniguard.
`vite.config.js` is only there so the local server serves `/omniguard` the way
Pages does.

## The free compliance check

The "Check my store" form on the Omniguard page calls the Omniguard Shopify
app, not this site: `https://omniguard.onrender.com/api/compliance-check` (set
in the form's `data-endpoint`). In local preview the form talks to
`http://localhost:3210` instead, which is the app started with `npm run local`
in the Omniguard repository.

If the site is ever served from a domain other than cybermango.ai, add it to
the app's `COMPLIANCE_CHECK_ORIGINS` environment variable.
