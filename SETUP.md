# Setup: Google sign-in

Glendale Parade Store, Process & Responsibilities Hub · Arista Systems Pvt. Ltd.

Access is restricted to **@aristasystems.in** accounts.

---

## Already done

`auth.js` line 32 carries the Client ID from the `ulla-johnson-hub` Google Cloud project:

```js
var GOOGLE_CLIENT_ID = "711818414372-4mf5ijucr7fj9641cae8inbgmf3vj1rt.apps.googleusercontent.com";
```

This portal reuses that same OAuth client, so if you are running both portals from the
same address there is nothing new to configure in the Google console.

---

## Run it locally

```powershell
cd path\to\glendale-hub
python -m http.server 8000
```

Open **http://localhost:8000** and sign in with your `@aristasystems.in` account.

Use `localhost`, not `127.0.0.1`, and port `8000`. Google treats those as different
origins, and `http://localhost:8000` is the one registered.

---

## If you serve it from a different address or port

Add that address as an **Authorised JavaScript origin**:

Google Cloud Console → Google Auth Platform → Clients → your client →
**Authorised JavaScript origins** → Add URI.

Origins are **domain only**, no path and no trailing slash. For example
`https://aristasystems0408.github.io`, not
`https://aristasystems0408.github.io/glendale-hub/`.

Leave **Authorised redirect URIs** empty; this sign-in method does not use them.

---

## Adding people

Publishing status is **Testing**, so only accounts on the Test users list can sign in.

Google Cloud Console → Google Auth Platform → **Audience** → **Test users** → Add users.

The team on this project is Sujitkumar, Mangesh, Prasidha, Anjali and Naseem, plus Vishal
Sartabe. Add whichever of them need access; only four Arista accounts are on the list today.

**When someone leaves the project, remove them from that list.** It is the only thing that
revokes access.

---

## What this sign-in does and does not cover

It stops anyone who opens the site normally, which covers the team and anyone the link is
forwarded to. It does not stop someone who reads the raw page source, because these are
static files that the host serves on request. If the files themselves need to be unreadable
without a login, that has to be enforced by a server rather than in the browser.

**If you publish this to GitHub Pages, keep the repository private and do not enable
Pages.** A public Pages site serves every file to anyone with the URL, including crawlers,
regardless of the login screen. That would expose the team's email addresses and the
man-hours figures.

---

## Changing things later

| Task | Where |
|---|---|
| Add or remove an allowed domain | `auth.js`, `ALLOWED_DOMAINS` |
| Change how long a sign-in lasts | `auth.js`, `SESSION_HOURS` (currently 8) |
| Remove the "Sign out" nav link | delete `<a class="nav-signout" ...>` from the 17 inner pages and the `.nav-signout` rule in `styles.css` |
| Change the site width | `styles.css`, `--page-max` (1560px) and `--bar-inner` |
| Change the header/footer height | `styles.css`, `--bar-h` (76px) |
