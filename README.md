# Frontline AI — landing page

One-page, dependency-free landing page (plain HTML/CSS/JS). Open `index.html` or serve the folder with any static host
(`python3 -m http.server`, Netlify, Cloudflare Pages, GitHub Pages, etc.).

```
index.html      page markup (semantic sections, SEO tags, JSON-LD)
css/styles.css  all styles; colors/spacing are CSS variables at the top
js/config.js    <- the only file you need to edit to go live
js/main.js      scroll reveal, sticky mobile bar, form validation + submit
favicon.svg, robots.txt
```

## Go-live checklist

1. **Calendar** – set `calendarUrl` in `js/config.js` to your GoHighLevel calendar link. Every "Book a Quick Call"
   button opens it in a new tab. While empty, those buttons scroll to the callback form.
2. **Form** – set `webhookUrl` to your GHL inbound webhook / form endpoint. The form POSTs `multipart/form-data`
   (no preflight) with: `name, business, phone, email, website, source, page`. If your endpoint blocks cross-origin
   requests, send it through a small proxy (e.g. a Cloudflare Worker) or use GHL's own form embed.
3. **Phone (optional)** – set `phone` (e.g. `+14085550123`) to show a tap-to-call link in the footer.
4. In `index.html`, replace `https://www.example.com/` in the canonical link with your real domain, and add an
   `og:image` once you have one.
5. Add a privacy policy / terms link in the footer before running cold-email traffic and text-message features.

## Content guardrails baked in

No testimonials, logos, customers, stats, awards or years in business. Mockups are labeled as sample layouts with
placeholder names. The review section states: no promised positive reviews, no ranking promises, no review gating.
