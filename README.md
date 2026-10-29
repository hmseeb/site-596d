# Hillside General Construction & Electrical Company

Static marketing site for Hillside General Construction & Electrical Company — general
construction and electrical contractors in Pasadena, CA, serving Los Angeles County.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies — serve the directory
as-is from any static host.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, residential / commercial / industrial services, EV rebate, owner note, reviews, service areas, estimate form, newsletter |
| `retrofit.html` | Retrofit services (seismic, energy efficiency, structural, ADA) |
| `electrical.html` | Electrical services (repairs, rewires, panel upgrades, EV chargers, solar, switchgear) |
| `contact.html` | Contact details and estimate request |

## Structure

```
index.html, retrofit.html, electrical.html, contact.html
favicon.svg                favicon
robots.txt, sitemap.xml    crawl directives
assets/styles.css          all styles (imports assets/fonts.css)
assets/fonts.css           @font-face declarations
assets/fonts/*.woff2       self-hosted Barlow Condensed + Inter (latin subset)
assets/main.js             nav toggle, form enhancement, confirmations
images/                    photography and logos carried over from the source site
```

## Forms

All five forms (estimate request on each page plus the newsletter) POST to the
LeadrVision endpoint:

```
https://vision.leadrai.com/api/forms/00d944904c7818c60c4952d3ed0f7caa
```

Each form carries `_form` (form name), `_page` (set to `window.location.href` on load),
and a hidden `_gotcha` honeypot. `assets/main.js` upgrades submission to `fetch()` with a
JSON body and shows an inline confirmation; if JavaScript or the network fails it falls
back to a normal browser POST. Plain submissions return to the page with `?submitted=1`,
which renders the same confirmation.

## Notes

- Primary call to action site-wide is **Call (818) 896-5400** (header, hero, after each
  service block, and a sticky bottom bar on mobile). "Request an estimate" is secondary.
- "Leave us a review" links point at `/review`, which is provided by the hosting platform —
  it is deliberately not defined in this repo.
- Works without JavaScript: forms post natively and the mobile nav is shown inline via a
  `<noscript>` style block.
- Verified: valid markup, one `<h1>` per page, no duplicate IDs, no broken links or
  anchors, no horizontal scroll at 390px, all tap targets >= 44px, and zero WCAG AA
  contrast failures across all pages at mobile and desktop widths.
