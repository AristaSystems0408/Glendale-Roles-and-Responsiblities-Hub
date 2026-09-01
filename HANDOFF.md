# Glendale Parade Store Hub · Handoff

Written for someone picking this up cold, including a new AI session with no memory of the
build. Read this before editing anything.

> **The shipped HTML, CSS and JS files are the single source of truth.** All data is hard
> coded inside them. There is no build step, no framework, no JSON, no API. Throwaway
> Python generators produced the first version from the workbook; they are **not included
> and must not be reintroduced**, because the files have been hand edited since.

---

## 1. What this is

Internal portal for the **Glendale Parade Store** account, built by Arista Systems Pvt. Ltd.
Static HTML/CSS/JS with browser-side Google sign-in restricted to `@aristasystems.in`.

Built from the Ulla Johnson portal, which shares the same stylesheet, `auth.js`,
`responsibilities.js` and layout system. Differences from that project are listed in §5.

**18 pages:**

| File | Contents |
|---|---|
| `index.html` | Login card and hero. Carries `<body class="home">`. Has its own `<style>` block that **overrides `styles.css`**, so hero and login changes belong there. |
| `departments.html` | Grid of 13 department cards |
| 13 department pages | Two tabs each: Department Tasks and Individual Responsibilities |
| `manhours-tracker.html` | Man-hours by process and month. Self-contained `<style>` block. |
| `org-chart.html` | The org chart image, framed |
| `directory.html` | Card per person, initials instead of photos |

Assets: `logo.png` / `logo-light.png` (Arista, carried over), `glendale-logo.png` and
`org-chart.png` (both cropped from the image embedded in the workbook's Project Hierarchy
sheet). No vector artwork was supplied for Glendale.

---

## 2. Where the data comes from

Single source: **`Glendale_Process_Overview.xlsx`**, five sheets.

| Sheet | Feeds | Notes |
|---|---|---|
| `Glendale Process` | Individual Responsibilities tabs | 260 rows. Column A is either a person's name (on a **merged** row) or a function; column B is the task. See §3. |
| `Sub tasks Division` | Department Tasks tabs | 207 rows: Sr No, All Task, Department. **The Department column was misaligned; see §4.** |
| `Members Details` | `directory.html` | 5 rows in the original workbook; Vishal Sartabe's row was supplied separately afterwards, making 6. No client email and no Slack handle, unlike the previous project. Hours are **EDT**. |
| `MH (Fixed Positions)` | `manhours-tracker.html` | 4 processes x 6 months, March to August, plus a totals row |
| `Project Hierarchy` | `org-chart.png`, job titles | Sheet is empty of cells but contains **one embedded image**, which is the org chart |

### 2.1 How the Process sheet is structured

Not obvious, and worth knowing before editing:

- A **merged** cell in column A starts a person's block: rows 2, 112, 150, 196, 214.
- Below that, column A holds a **function name** and column B the task.
- **In Naseem's block only** (rows 215 to 266), column A is filled on the first row of each
  function and left blank for the rest. Every other block repeats the function name on
  every row. A parser must carry the last non-blank value forward.

Resulting distribution, which reconciles exactly with §4:

| Person | Title (from the org chart) | Tasks | Functions |
|---|---|---|---|
| Sujitkumar | Overall Marketing Manager | 109 | 10 |
| Mangesh | SEO Executive | 37 | 5 |
| Prasidha | Organic Social Media Executive | 45 | 4 |
| Anjali | Content Writer | 16 | 5 |
| Naseem | Senior Developer | 52 | 12 |
| **Total** | | **259** | |

Note the workbook labels Sujit's block "Overall Marketing Manager - Sujit"; the directory
sheet calls him "Sujitkumar". The portal uses **Sujitkumar** throughout.

---

## 3. People: who is and is not in this portal

| Person | In Members Details | On org chart | Has tasks | In portal |
|---|---|---|---|---|
| Sujitkumar | yes | yes | 109 | yes |
| Mangesh | yes | yes | 37 | yes |
| Prasidha | yes | yes | 45 | yes |
| Anjali | yes | yes | 16 | yes |
| Naseem | yes | yes | 52 | yes |
| **Vishal Sartabe** | added later by the client | yes, Project Manager | none | Directory and org chart only, no department page. Contact details were supplied separately after the first build: `vishal@aristasystems.in`, 4.30 AM to 2.30 PM EDT. He holds no tasks, so his card shows no department tags and the empty tag row is collapsed by CSS. |
| **Gourav** | no | no | none | **Excluded, confirmed by the client.** He is named four times inside task text as the person creative work is coordinated with, and the 22 Graphic Design and Creative QA tasks sit under **Prasidha's** block. The client confirmed he is not a member of this project, so those tasks remain Prasidha's, exactly as the workbook has them. Do not move them without asking. |
| **Himanshi** | no | no | none | Excluded. Named once, in a task about internal reviews, with no tasks of her own anywhere. |

---

## 4. The department correction (important)

The `Department` column in `Sub tasks Division` was **shifted down by one row**. The first
task of each department block carried the *previous* department's label. Example, row 22:

> "Manage and optimize Glendale paid media across Google Ads and Microsoft Ads"
> was labelled **Overall Marketing**

**The client approved correcting this.** The column was shifted up one row, changing 11 rows:

| Row | Was | Now |
|---|---|---|
| 22 | Overall Marketing | Paid Media |
| 44 | Paid Media | Analytics & Tracking |
| 53 | Analytics & Tracking | Website / UI-UX / CRO |
| 61 | Website / UI-UX / CRO | Team Management & Quality Control |
| 71 | Team Management & Quality Control | Reporting & Project Management |
| 79 | Reporting & Project Management | Promotions & Campaign Management |
| 86 | Promotions & Campaign Management | SEO |
| 123 | SEO | Organic Social Media |
| 146 | Organic Social Media | Email Marketing |
| 171 | Email Marketing | Creative / Graphic Design |
| 193 | Creative / Graphic Design | Content / Blogs |

**How the correction was verified**, and why it is safe to trust: after the shift, each
person's task count in the Process sheet matches the corrected department counts *exactly*.
Sujit's ten functions sum to 20 + 22 + 9 + 8 + 10 + 8 + 7 + 25 = 109. Mangesh's five SEO
functions sum to 37. Prasidha's four sum to 23 + 22 = 45. Anjali's five sum to 16. Total
207, which is exactly the row count of `Sub tasks Division`. Two independently authored
sheets agreeing to the task is strong evidence the shift is right.

**If the workbook is ever re-supplied, check whether this is still wrong before rebuilding.**

### 4.1 Department counts

| Department | Tasks | Owner |
|---|---|---|
| Overall Marketing | 20 | Sujitkumar |
| Paid Media | 22 | Sujitkumar |
| Analytics & Tracking | 9 | Sujitkumar |
| Website / UI-UX / CRO | 8 | Sujitkumar |
| Team Management & Quality Control | 10 | Sujitkumar |
| Reporting & Project Management | 8 | Sujitkumar |
| Promotions & Campaign Management | 7 | Sujitkumar |
| SEO | 37 | Mangesh |
| Organic Social Media | 23 | Prasidha |
| Email Marketing | 25 | Sujitkumar |
| Creative / Graphic Design | 22 | Prasidha |
| Content / Blogs | 16 | Anjali |
| **Technology & Development** | **52** | Naseem |
| **Total** | **259** | |

**Technology & Development is not in the workbook's task division sheet**, which covers the
marketing functions only. The client approved adding it, taking the name from the banner
above Naseem on the org chart. Because there is no separate condensed list for it, its
Department Tasks tab is the flat version of the same tasks shown grouped by function on the
Individual Responsibilities tab. A short note on that page says so.

Every department has exactly **one** owner, so `responsibilities.js` never collapses
anything: with a single person listed it leaves the block expanded. That is the template's
existing behaviour, not a bug.

---

## 5. Man-hours tracker

| Process | Mar | Apr | May | Jun | Jul | Aug | Total |
|---|---|---|---|---|---|---|---|
| All Paid Ads | 180 | 180 | 200 | 210 | 220 | 260 | 1,250 |
| SEO | 90 | 90 | 90 | 90 | 90 | 90 | 540 |
| Organic Socil Media | 120 | 110 | 120 | 135 | 125 | 120 | 730 |
| Blogs | 32 | 32 | 32 | 32 | 32 | 32 | 192 |
| **Total** | **422** | **412** | **442** | **467** | **467** | **502** | **2,712** |

Reconciles both directions to 2,712.

Three things to keep:

1. **"Organic Socil Media" is the workbook's spelling.** Preserved verbatim, per the same
   convention used on the previous project. Fix at source first, then here.
2. **August is a fixed allocation**, not an actual. The sheet's column header says
   "August (Fixed)", so the page marks that month with a **Fixed** chip in the month strip
   and a small "fixed" note in the table header. Do not drop that distinction.
3. **The year is 2026**, taken from the client's confirmation on the previous project. The
   sheet itself does not state a year. It appears in the period tile and the table heading.

The tracker covers only these four processes. There are no hours for Email Marketing,
Creative, Website, Analytics or Naseem's technical work, so the totals are **not** whole-project
hours. Worth saying out loud if anyone reads 2,712 as the full account.

---

## 6. Differences from the Ulla Johnson portal

Same stylesheet, `auth.js`, `responsibilities.js`, widths, bar height and login flow.
What changed:

- **13 departments, not 4.** The 4-card grid rules keyed off
  `:has(> .dept-card:nth-child(4):last-child)` and no longer apply. A new rule gives a
  4-across grid at 92px card height. **If a department is added or removed, that rule and
  the card list both need updating.**
- **Directory uses initials, not photos.** The workbook has no team photos, so there are no
  `person-*.png` files. `.pc-initials` replaces `.pc-photo`.
- **Directory has three fields per person**, not five: Arista email, hours, team. No client
  email and no Slack handle were supplied. Hours are **EDT**, not EST.
- **Tracker is man-hours, not units**, and has a single view rather than two tabs.
- **The client wordmark is much wider** (about 13:1 against Ulla Johnson's 7:1), so
  `.page-brand img` is 17px rather than 27px.
- **Department pages scroll.** Task lists run to 52 items, so the strict one-screen rule from
  the previous project cannot apply here. The five hub pages (Home, Departments, Tracker,
  Directory, Org Chart) do all fit a 1911x900 viewport with no scrolling.
- **Category sub-headings inside a person block carry a count chip**, since people here have
  up to twelve functions each.

## 6.1 Premium pass and full-height tracker

A later refinement round, no structural change:

- **Layered shadows.** A close contact shadow plus a wider ambient one on every surface
  (`--sh-1` to `--sh-3`), replacing the single flat shadow. This is most of what makes an
  edge read as having weight.
- **Type detail.** Tighter tracking on large headings, looser on small capitals, tabular
  numerals wherever figures are compared in a column.
- **Department cards** got a hairline accent under the name that grows on hover, a quieter
  resting gradient, and a press state.
- **Hero** gained a two-point vignette so the dark panel has depth rather than a flat wash.
- **Focus rings** were added for keyboard users; the base template had none.

**The Man-Hours Tracker now fills the viewport.** `.trk-wrap` is a flex column, `.trk-body`
grows, and `.yoy-card` takes the remaining height with `table { height: 100% }` so the four
process rows share the slack. It therefore fills the page at any window height rather than
only at 900px, sitting 20px clear of the footer at both 900 and 1080.

**One bug found and fixed while doing that:** `td.shr` was `display: flex`, which takes the
cell out of table-cell layout. Once the table started stretching, the TOTAL row's share cell
rendered as a white block at the wrong height. The flex moved to an inner `.shr-in` wrapper
and the cell went back to being a table cell. **If that share column is ever edited, keep the
wrapper.**

---

---

## 7. Verification performed

Two automated passes. Re-run both after any data or layout change.

**Content**, by reading the workbook with `openpyxl` and the pages as tag-stripped text:

- all 207 corrected department tasks on the correct department page
- all 259 individual responsibilities on the page their function maps to, plus every
  function heading
- every Members Details field, all six people, all six job titles
- all 4 processes, 24 monthly values, 4 row totals, 6 column totals and the grand total
- man-hours reconcile in both directions
- no placeholders, no reference to the previous client, `auth.js` and the Google script on
  all 18 pages, `noindex` on all 18, guard and sign-out on all 17 inner pages
- all 13 department cards link to a page that exists

**Result: all pass.**

**Layout**, in headless Chromium at 1440 and 1911 wide:

- no horizontal scrolling on the document or on any element
- header and footer both 76px, logo 45px, and the navbar, footer and page content share the
  same left edge to the decimal on all 18 pages
- every image loads
- no console errors

**Result: all pass**, re-confirmed after the premium pass at 1911x900, 1911x1080, 1600x900,
1440x900 and 1280x900. No horizontal scrolling anywhere; the five hub pages fit every one of
those viewports with no vertical scrolling either. Department pages scroll, which is expected
given task lists of up to 52 items.

The only failed requests in testing were `fonts.googleapis.com` and `accounts.google.com`,
both blocked by the build sandbox and both fine on a real machine. Worth knowing when reading
test output: a bare "403" in the console is that, not a fault in the build.

---

## 8. Open items

1. **"Organic Socil Media"** spelling, and whether to correct it at source (§5).
2. **Gourav.** Excluded per the client's answer, but the workbook still has 22 creative
   tasks under Prasidha while her own tasks say she coordinates creative *with Gourav*. If
   that ever looks wrong to the client, the fix is to add him as a sixth person and move
   rows 174 to 195 of the Process sheet to him.
3. **Server-enforced access**, if the browser-side gate is ever judged insufficient. The
   equivalent build for the previous project exists and the same approach would apply here.
