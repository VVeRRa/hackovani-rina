# Háčkování Rina

AI-assisted work-in-progress e-shop for a real handmade-products creator.

**Production demo:** https://hackovani-rina-seven.vercel.app/

The website is being built for a real person and her handmade-products business. The current product data and some content are illustrative, while the overall visual direction — including the colour palette — was chosen by the client herself.

The project is intentionally still a WIP. It is a portfolio example of taking a real-world idea from product requirements through a working implementation rather than presenting a finished production store.

## Why I built it

I wanted to explore an end-to-end product workflow: define the behaviour of a small e-shop, model its content in a headless CMS, build the storefront, iterate on UX, and use AI as an implementation and review partner.

The implementation was created and iterated with **Antigravity** and **ChatGPT**. My focus was on requirements, product behaviour, CMS integration, UX decisions, iteration, and reviewing/refining the generated solution.

## Stack

- Next.js 16 / React 19
- TypeScript
- DatoCMS
- Vercel
- AI-assisted implementation and review with Antigravity + ChatGPT

## Implemented

- product catalogue backed by DatoCMS
- products, variants, stock and custom attributes
- category, property and full-text filtering
- product detail and variant selection
- cart persisted in local storage
- wishlist
- Czech / English / German UI
- contact form persisted to DatoCMS
- password-protected internal admin for reviewing contact submissions
- contact-form spam protection and rate limiting
- regression tests for cart, admin, contact protection and product filtering
- GitHub Actions CI running tests and a production build
- short-lived server-side DatoCMS cache
- responsive storefront UI

## Content workflow

Routine storefront maintenance is handled in DatoCMS rather than in code. Products, variants, stock, categories, pages and hero content are read dynamically by the production app, so normal content changes appear in production without a code change or redeploy. The runtime uses a short per-instance cache (about 60 seconds), so normal CMS changes propagate automatically without exposing a public cache-bypass endpoint.

This means day-to-day catalogue and content maintenance does not require a programmer unless something breaks or the requested change affects application behaviour or the CMS schema.

The static UI is available in Czech, English and German. Dynamic content coming from DatoCMS is translated at runtime as well: known terminology uses curated mappings first, while previously unseen text falls back to the translation endpoint and is cached. This means ordinary catalogue/content edits can appear in the supported language versions without maintaining three separate CMS copies, changing application code or redeploying the site.

## Security notes

- runtime secrets are read from server-side environment variables only
- the storefront uses a read-only DatoCMS token that should be scoped to public content models only
- contact submissions use a separate least-privilege DatoCMS write token restricted to the contact-form model
- the internal admin uses a signed, short-lived HttpOnly session cookie and rate-limited login attempts
- the public contact and translation endpoints validate/bound input and apply lightweight abuse protection
- the application exposes only the CMS fields required by the storefront; internal contact submissions are available only through the authenticated admin

The in-process rate limits are intentionally lightweight and per server instance. A higher-traffic public deployment should combine them with platform/edge rate limiting or WAF controls.

## WIP / known gaps

- payment gateway and real order processing are not implemented yet
- checkout is currently a UI prototype
- authentication / customer accounts are not implemented
- some AI-generated components are larger than I would keep in a mature codebase and are candidates for decomposition
- routing and dynamic translation can be simplified/refined further
- caching and application-level rate limiting are intentionally lightweight and per server instance rather than shared infrastructure

## Local development

```bash
npm install
npm run dev
```

For local development with live DatoCMS data, create `.env.local`:

```env
DATOCMS_READ_ONLY_API_TOKEN=...
DATOCMS_WRITE_API_TOKEN=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

The read-only token is used to load storefront content and should be restricted to the public content models only (for example products, variants, categories, pages and hero content). The write token is used server-side only for contact-form records: it creates/publishes public submissions and lets the authenticated internal admin read, edit and publish those same records. Its DatoCMS role should be restricted to the contact-form model and allow Create, Read, Edit and Publish/unpublish for those records. `ADMIN_PASSWORD` authenticates the internal `/admin` page and `ADMIN_SESSION_SECRET` signs short-lived HttpOnly admin sessions.

Keep every token and password server-only, use least-privilege DatoCMS roles, choose a strong unique admin password and a high-entropy session secret, and never commit real secrets.
