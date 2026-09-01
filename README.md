# Glendale Parade Store · Process & Responsibilities Hub

Internal portal for the **Glendale Parade Store** account, built by **Arista Systems Pvt. Ltd.**
Static HTML, CSS and JavaScript behind a Google sign-in restricted to `@aristasystems.in`.

---

## Run it

```powershell
cd path\to\glendale-hub
python -m http.server 8000
```

Open **http://localhost:8000**

Google sign-in does not work from a `file://` path, so it has to be served. Use `localhost`
and port `8000` to match the origin registered in the Google console.

---

## What's in it

| Page | Shows |
|---|---|
| **Home** | Landing page |
| **Departments** | All 13 functions on the account |
| **Department pages** | Two tabs: every task the department owns, and each person's responsibilities grouped by function |
| **Man-Hours Tracker** | Hours by process per month, March to August 2026. August is a fixed allocation. |
| **Org Chart** | Reporting lines |
| **Directory** | Card per person: role, departments covered, Arista mailbox, working hours (EDT) |

259 tasks across 13 departments and 6 people.

---

## Editing it

The HTML, CSS and JS files **are** the project. All content is hard coded, so edit the files
directly.

- **Append new CSS at the end of `styles.css`**, below the `GLENDALE PARADE STORE` banner.
  Do not reorder what is above it; the file relies on rule order.
- **Hero and login styling lives in `index.html`'s own `<style>` block**, which overrides
  `styles.css`. Edit it there.
- Width is set once, as `--page-max` and `--bar-inner` in `styles.css`; bar height as
  `--bar-h`. The navbar, footer and page content all follow them, which is what keeps the
  logo aligned with the content beneath it.

---

## Before you change any data

Read **`HANDOFF.md`** first. Two things in particular:

- The workbook's Department column was misaligned by one row and has been **corrected** for
  11 tasks. §4 explains how that was verified.
- **Technology & Development** was added as a 13th department for Naseem's 52 technical
  tasks, which the workbook's task division sheet does not cover.

Setup, sign-in and adding people: **`SETUP.md`**.

---

## Files

```
index.html                        Login and landing
departments.html                  13 department cards
overall-marketing.html            ┐
paid-media.html                   │
analytics-tracking.html           │
website-uiux-cro.html             │
team-management-quality.html      │ department pages
reporting-project-management.html │
promotions-campaign-management.html
seo.html                          │
organic-social-media.html         │
email-marketing.html              │
creative-graphic-design.html      │
content-blogs.html                │
technology-development.html       ┘
manhours-tracker.html             Man-hours by process
org-chart.html                    Org chart
directory.html                    Team directory
styles.css                        Shared stylesheet
auth.js                           Google sign-in, @aristasystems.in only
responsibilities.js               Collapsible person blocks
logo.png / logo-light.png         Arista Systems logo
glendale-logo.png                 Client wordmark
org-chart.png                     Org chart image
SETUP.md                          Sign-in setup and adding people
HANDOFF.md                        Full documentation, read before editing
README.md                         This file
```

Data source: `Glendale_Process_Overview.xlsx`. The client wordmark and org chart were both
cropped from the image embedded in that workbook's Project Hierarchy sheet; no vector
artwork was supplied.

---

© 2026 Arista Systems Pvt. Ltd.
