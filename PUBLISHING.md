# Publishing to the Chrome Web Store

Findings from reading the Chrome Web Store Developer Program Policies and Reddit's User Agreement and Trademark
Use Policy on 2026-10-14. This is a developer's reading, not legal advice.

## Chrome Web Store policies: nothing blocks this extension

- **Hiding page content is allowed.** The policies have no rule against content scripts that hide elements on a
  third-party site. Ad blockers and several "hide promoted posts on Reddit" extensions are already listed. The only
  ad rule that mentions third-party sites is about ads *your extension shows* interfering with a site's ads, which
  does not apply: this extension shows nothing.
- **Single purpose.** An extension "must have a single purpose that is narrow and easy to understand". Hiding ads
  and hiding suggested posts are two faces of one purpose: removing content Reddit injects into your feed that you
  did not subscribe to. Describe it that way in the listing's single-purpose field.
- **User data.** A privacy policy is required only "if your Product handles any user data". This extension collects,
  stores and transmits nothing, so none is needed. The Privacy tab still has to be filled in: certify no data
  collection and justify the one host match (reddit.com) as needed to run the content script.
- **Permissions.** "Request access to the narrowest permissions necessary." The manifest requests no permissions and
  only a content-script match on reddit.com, which is as narrow as it gets.
- **Minimum functionality and quality.** The extension must work (it does) and offer "a unique, high-quality
  experience". Similar extensions exist, so the listing should say what this one does differently: it hides
  suggested posts as well as ads, decides by Reddit's own feed markup rather than text matching, and needs no
  permissions.
- **Impersonation and intellectual property.** "Don't represent that your product is authorized by, endorsed by, or
  produced by another company" and "don't infringe on the intellectual property rights of others, including
  trademark". This is the one area that needs a change; see the naming section.

## Reddit's terms: an ad blocker's risk, no more

Reddit's User Agreement says you may not "use the Services in any manner that could interfere with, disable, disrupt,
overburden, or otherwise impair the Services" or "modify, prepare derivative works of ... any part of the Services".
A broad reading of "modify" covers any extension that changes how reddit.com renders in your own browser, including
every ad blocker. Reddit does not enforce that reading against ad blockers, and this extension sends no requests of
its own, so it cannot overburden anything. The residual risk is the same one every ad-blocker user carries, and it
sits with the user's account rather than with the store listing.

## Naming: why it is "Clean Feed for Reddit"

Reddit's Trademark Use Policy says you may not "use, register, or otherwise claim rights in trademarks, trade names,
company names ... that are identical, confusingly similar to, or contain any of Reddit's trademarks" or use them "in a
way that suggests an affiliation with, an endorsement by, or a sponsorship by Reddit". The original name, "Clean Reddit", contained the
mark and read like a Reddit product. Reddit has forced renames before ("Reddit is Fun" became "rif is fun for
reddit" in 2020), and Google removes listings on a trademark owner's complaint, with republishing only allowed under a
new package name.

The accepted pattern, and the one Google's own branding guidance recommends for compatible products, is
"<name> for Reddit", so the extension is named **Clean Feed for Reddit**. Keep these in place:

- The manifest description and the store listing carry "Not affiliated with Reddit, Inc."
- The icon stays free of Snoo and of Reddit's OrangeRed (#FF4500). The current icon is a teal disc for that reason.

## What publishing takes

1. A Chrome Web Store developer account on the Google account you want to own the listing. There is a one-time
   registration fee (US$5 at the time of writing) and the account email cannot be changed afterwards. New accounts
   are limited to two published extensions.
2. A ZIP of this folder's extension files only: `manifest.json`, `content.js`, `content.css`, `icons/`. Leave out
   `README.md`, `PUBLISHING.md`, `compat-check.js`, `.claude/` and `.git/`.
3. Listing images: the 128x128 icon (artwork 96x96 inside 16px transparent padding), one required 440x280 small
   promo tile, and one to five 1280x800 screenshots with square corners and no padding. The current icon is a
   placeholder and should be redrawn to that spec before submission.
4. Listing text: name, a short summary, a description that discloses exactly what is hidden ("all functionalities
   ... should be clearly disclosed to the user, with no surprises"), the single-purpose statement, and the
   affiliation disclaimer.
5. Submit for review. Review time varies; extensions with no permissions and no remote code are the simplest
   category. After approval you have 30 days to publish a staged submission before it reverts to draft.

## Keep it reviewable after launch

Reddit changes its markup without notice, and a listed extension that no longer works breaks the "broken
functionality" rule. Run `compat-check.js` (or `/reddit-compat`) when Reddit ships a visible redesign, and after any
report that ads or suggested posts are showing again.
