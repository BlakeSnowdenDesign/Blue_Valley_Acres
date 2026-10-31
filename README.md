# Blue Valley Acres website

Source for the Blue Valley Acres Land Share site, built on **Wix Studio** (site id `7a50efc4-94cc-4133-b372-15bdde5c80c7`, live at https://snowden-design.wixstudio.com/blue-valley-acres).

Each page is one or more **Embed HTML** elements whose code is generated here, plus a small amount of Velo code.

## Layout

| Path | What it is |
|---|---|
| `Build/src/*.html` | Page sources: a `<!--title:…-->` comment, page-specific `<style>`, the body markup, and an optional `<script>`. |
| `Build/pages/_base.css` | Shared theme (fonts, colors, gradient, hero, cards, reveal animations). |
| `Build/build.py` | Assembles `src/*.html` + `_base.css` into self-contained `Build/pages/*.html`, adds the reveal/Ken Burns script and the link bridge (see below). Run `python3 build.py` from `Build/`. |
| `Build/pages/*.html` | **What gets pasted into Wix.** One file per Embed HTML element. |
| `Build/pages/home-hero-text.html`, `code/home-hero-text.html` | Transparent hero text that sits over the Home video (buttons to /about and /conditions). |
| `Build/pages/_frame.html`, `_measure.html`, `_sheet*.html` | Local preview/measuring helpers (serve `Build/pages` with `python3 -m http.server 8765`). |
| `Build/velo-bridge.txt` | The link-bridge snippet appended to every embed. |
| `velo/` | Velo code and the CMS collection schema (see below). |
| `Design Docs/` | The original design document. |

## Where each embed goes in Wix Studio

| Page (slug) | Embed element(s) | Source file | Heights desktop / tablet / mobile |
|---|---|---|---|
| Home (`/`) | `#html1` (page body) | `pages/home.html` | 4800 / 6200 / 6550 |
| Home video section | `#html2` (hero text over the video) | `pages/home-hero-text.html` | 600 at the 2200px breakpoint |
| About | `#html1` | `pages/about.html` | 2410 |
| Location | `#html1` | `pages/location.html` | 2990 / 3380 / 3290 |
| News | `#html1` | `pages/news.html` | 3680 / 4710 / 5610 |
| Member Resources | `#html1` | `pages/member-resources.html` | 4040 / 5630 / 6450 |
| Safety | `#html1` | `pages/safety.html` | 2490 / 3510 / 3590 |
| Photos | `#html1` | `pages/photos.html` | 3390 / 4460 / 8680 |
| Contact | `#html1` | `pages/contact.html` | 1210 |
| Conditions | `#html1` weather, `#html2` I-70 cameras, `#html4` river & reservoir, `#html3` sky & roads (in that page order) | `conditions.html`, `i70-cameras.html`, `river.html`, `live-weather.html` | 1440/1890/2160 · 1190/1600/3040 · 920/1750/2120 · 1550/2520/2870 |
| Pay Dues | `#duesForm` | `pages/pay-dues.html` | 1940 |
| Members | `#html1` | `pages/members.html` | 2550 / 3340 / 3870 |
| Activities | `#html1` | `pages/activities.html` | 6500 / 9500 / 9150 |
| Places | `#html1` | `pages/places.html` | 4700 / 6110 / 7830 |

To update a page: edit `Build/src/<page>.html`, run `build.py`, open the element in Studio → **Edit Code**, replace the whole code with `Build/pages/<page>.html`, **Update**, then check the element height on each breakpoint.

## Links inside embeds (the bridge)

Wix sandboxes Embed HTML iframes without `allow-top-navigation`, so `target="_top"` links cannot change the page by themselves. Every embed therefore ends with a tiny script (`Build/velo-bridge.txt`, added automatically by `build.py`) that posts `{bvaGo: "/slug"}` to the parent on click, and `velo/masterPage.js` listens with `$w('HtmlComponent').onMessage` and calls `wixLocation.to()`. Keep both halves when editing.

## Velo

| File in this repo | Where it lives in Wix Studio (Dev Mode) |
|---|---|
| `velo/masterPage.js` | Page Code → `masterPage.js` (link bridge; hides the site menu and header on Home, which has its own video header) |
| `velo/pages/pay-dues.js` | Page Code → Pay Dues page |
| `velo/backend/dues.web.js` | Backend & Public → `backend/dues.web.js` |
| `velo/backend/events.js` | Backend & Public → `backend/events.js` |
| `velo/collections.md` | CMS → `DuesPayments` collection schema |

Wix Payments must be connected in the dashboard before the dues checkout can take real payments.

## Media

Photos, logos and hero videos are uploaded to the Wix media library and referenced by `static.wixstatic.com` URLs in the sources; the large originals are not kept in this repo.
