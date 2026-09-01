/* ============================================================================
   Glendale Parade Store, Process & Responsibilities Hub
   Arista Systems Pvt. Ltd.

   Google sign-in, restricted to @aristasystems.in.

   ---------------------------------------------------------------------------
   SET THIS ONE VALUE AND YOU ARE DONE
   ---------------------------------------------------------------------------
   Paste the OAuth Client ID from Google Cloud Console below. Nothing else in
   this file needs changing.

   Note it is a Client ID only, no client secret. A secret must never appear in
   a file the browser downloads.
   ---------------------------------------------------------------------------

   HOW IT WORKS
   Google verifies who the person is and hands back a signed ID token. This
   file reads the email out of that token and lets them in only if the domain
   is on the list below. The result is kept for 8 hours, then they sign in
   again.

   WHAT THIS PROTECTS AGAINST, AND WHAT IT DOES NOT
   This is a browser-side gate. It stops people who open the site normally,
   which covers the whole team and anyone the link gets forwarded to. It does
   not stop someone who knows how to read the page source directly, because
   the pages are static files that the web server hands out on request. If you
   later need the files themselves to be unreadable without a login, that has
   to be enforced by the server, not here.
   ============================================================================ */

var GOOGLE_CLIENT_ID = "711818414372-4mf5ijucr7fj9641cae8inbgmf3vj1rt.apps.googleusercontent.com";

/* Who may sign in. Add or remove a line and that is the whole change: the login
   screen text and every error message are generated from this list, so nothing
   else needs editing.

   Anyone added here must also be added under Audience -> Test users in the
   Google Cloud console, because the app's publishing status is Testing. */
var ALLOWED_DOMAINS = [
  "aristasystems.in",
];

var SESSION_HOURS = 8;

/* Stricter check, off by default. See the note at the bottom of SETUP.md.

   With this false, anyone whose Google account email ends in one of the two
   domains gets in. That is what you asked for, and it is what is running.

   With this true, the account must additionally be a genuine Google Workspace
   account belonging to that domain. This closes one narrow gap: Google lets a
   person create an ordinary consumer Google account using any email address
   they can receive mail at, including one at a company domain, and such an
   account is not part of that company's Workspace. Turning this on refuses
   those.

   Only switch it on once you have confirmed BOTH domains are Google Workspace.
   If either is not, its real users would be refused. Test with one account from
   each domain before relying on it. */
var REQUIRE_WORKSPACE_ACCOUNT = false;

/* ========================= nothing below needs editing ==================== */

var SESSION_KEY = "uj_session";

/* ------------------------------------------------------------------ helpers */

function ujDecodeJwt(token) {
  var parts = String(token || "").split(".");
  if (parts.length !== 3) throw new Error("malformed token");
  var b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  var json = decodeURIComponent(
    atob(b64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(json);
}

function ujDomainOf(email) {
  var e = String(email || "").trim().toLowerCase();
  var at = e.lastIndexOf("@");
  return at > 0 ? e.slice(at + 1) : "";
}

function ujIsAllowedEmail(email) {
  return ALLOWED_DOMAINS.indexOf(ujDomainOf(email)) !== -1;
}

function ujClientIdIsSet() {
  return (
    typeof GOOGLE_CLIENT_ID === "string" &&
    GOOGLE_CLIENT_ID.indexOf("PASTE_YOUR_CLIENT_ID") === -1 &&
    GOOGLE_CLIENT_ID.indexOf(".apps.googleusercontent.com") !== -1
  );
}

/* ------------------------------------------------------------------ session */

function ujSaveSession(claims) {
  var session = {
    email: claims.email,
    name: claims.name || claims.given_name || "",
    picture: claims.picture || "",
    hd: claims.hd || "",
    exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error("Could not save the session:", e);
  }
  return session;
}

function ujReadSession() {
  try {
    var raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    var s = JSON.parse(raw);
    if (!s || !s.email || !s.exp) return null;
    if (Date.now() > s.exp) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    // Re-check the domain every time, so editing ALLOWED_DOMAINS takes effect
    // for people who are already signed in.
    if (!ujIsAllowedEmail(s.email)) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    // Re-check on every page load too, so turning the flag on takes effect for
    // people who are already signed in.
    if (REQUIRE_WORKSPACE_ACCOUNT) {
      var hd = String(s.hd || "").trim().toLowerCase();
      if (!hd || ALLOWED_DOMAINS.indexOf(hd) === -1) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
    }
    return s;
  } catch (e) {
    return null;
  }
}

/* Used by the guard at the bottom of every page. */
function isUserLoggedIn() {
  return ujReadSession() !== null;
}

function currentUser() {
  return ujReadSession();
}

function currentUserEmail() {
  var s = ujReadSession();
  return s ? s.email : "";
}

function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {}
  if (window.google && google.accounts && google.accounts.id) {
    try {
      google.accounts.id.disableAutoSelect();
    } catch (e) {}
  }
  window.location.replace("index.html");
}

/* ------------------------------------------------- validate Google's token */

function ujHandleCredential(response, onSuccess, onError) {
  try {
    var claims = ujDecodeJwt(response.credential);

    if (claims.aud !== GOOGLE_CLIENT_ID) {
      return onError("This sign-in was issued for a different application.");
    }
    if (claims.iss !== "https://accounts.google.com" && claims.iss !== "accounts.google.com") {
      return onError("Sign-in came from an unexpected source.");
    }
    if (!claims.exp || claims.exp * 1000 <= Date.now()) {
      return onError("That sign-in has expired. Please try again.");
    }
    if (claims.email_verified !== true) {
      return onError("That Google account does not have a verified email address.");
    }
    if (REQUIRE_WORKSPACE_ACCOUNT) {
      var hd = String(claims.hd || "").trim().toLowerCase();
      if (!hd || ALLOWED_DOMAINS.indexOf(hd) === -1) {
        return onError(
          "That account is not a managed " +
            ujDomainSentence() +
            " account. Sign in with your work Google account."
        );
      }
    }

    if (!ujIsAllowedEmail(claims.email)) {
      return onError(
        "Access is limited to " +
          ujDomainSentence() +
          " accounts. You signed in as " +
          claims.email +
          "."
      );
    }

    ujSaveSession(claims);
    onSuccess(claims);
  } catch (e) {
    console.error(e);
    onError("Sign-in could not be completed. Please try again.");
  }
}

/* -------------------------------------------- render the Google sign-in UI */

/**
 * Draws Google's official sign-in button into the given element.
 * containerId : id of the element to render into
 * onSuccess   : called with the Google claims once the domain check passes
 * onError     : called with a message to show the person
 */
function initGoogleSignIn(containerId, onSuccess, onError) {
  var container = document.getElementById(containerId);
  if (!container) return;

  if (!ujClientIdIsSet()) {
    onError(
      "Google sign-in is not configured yet. Paste your OAuth Client ID into auth.js."
    );
    return;
  }

  var attempts = 0;
  (function waitForGoogle() {
    if (window.google && google.accounts && google.accounts.id) {
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: function (res) {
            ujHandleCredential(res, onSuccess, onError);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,
        });
        google.accounts.id.renderButton(container, {
          theme: "filled_blue",
          size: "large",
          shape: "pill",
          text: "signin_with",
          logo_alignment: "left",
          width: 300,
        });
      } catch (e) {
        console.error(e);
        onError("Google sign-in failed to start. Check the Client ID in auth.js.");
      }
      return;
    }
    attempts += 1;
    if (attempts > 60) {
      onError(
        "Could not reach Google sign-in. Check your internet connection, then reload."
      );
      return;
    }
    setTimeout(waitForGoogle, 100);
  })();
}

/* ------------------------------------------------------- expose to the pages */

window.isUserLoggedIn = isUserLoggedIn;
window.currentUser = currentUser;
window.currentUserEmail = currentUserEmail;
window.logout = logout;
window.initGoogleSignIn = initGoogleSignIn;
window.ALLOWED_DOMAINS = ALLOWED_DOMAINS;

/* If someone signs out in another tab, this tab follows. */
/* Reads the allowed domains out into a sentence, so the login screen can never
   disagree with ALLOWED_DOMAINS above. */
function ujDomainSentence() {
  var list = ALLOWED_DOMAINS.map(function (d) {
    return "@" + d;
  });
  if (list.length === 1) return list[0];
  return list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
}
window.ujDomainSentence = ujDomainSentence;

window.addEventListener("DOMContentLoaded", function () {
  var note = document.getElementById("login-note");
  if (note) {
    note.textContent =
      "Access is limited to " +
      ujDomainSentence() +
      (ALLOWED_DOMAINS.length === 1 ? " accounts." : " accounts.");
  }
});

/* Puts "Signed in as ..." on the Sign out link as a tooltip. No visual change. */
window.addEventListener("DOMContentLoaded", function () {
  var s = ujReadSession();
  if (!s) return;
  var links = document.querySelectorAll("a.nav-signout");
  for (var i = 0; i < links.length; i++) {
    links[i].title = "Signed in as " + s.email + ". Click to sign out.";
  }
});

window.addEventListener("storage", function (e) {
  if (e.key === SESSION_KEY && e.newValue === null) {
    var onLanding = /(^|\/)index\.html?$/.test(location.pathname) || location.pathname.endsWith("/");
    if (!onLanding) window.location.replace("index.html");
  }
});
