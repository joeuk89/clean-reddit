---
name: reddit-compat
description: Check that Clean Feed for Reddit still matches Reddit's current markup by running compat-check.js in a logged-in browser tab.
disable-model-invocation: true
---

Run the compatibility check in `compat-check.js` against the live Reddit home feed and report the table.

1. Open `https://www.reddit.com/` with the chrome-devtools MCP (`new_page` or `navigate_page`). If the title is "Prove your humanity" or the page shows a Log In button, stop and ask Joe to complete the CAPTCHA and log in in that window, then continue when he says so. Never attempt the CAPTCHA.
2. Confirm login: `evaluate_script` returning `document.querySelector('shreddit-app')?.getAttribute('user-logged-in')` must be `"true"`.
3. Inject the extension so the install checks mean something: read `content.css` and `content.js` from the repo root and run them via `evaluate_script` (append the CSS in a `<style>`, then eval the script). Pass `waitForStableDom: false` to every `evaluate_script` call; Reddit's feed never settles.
4. Run `compat-check.js` via `evaluate_script` and capture the returned array.
5. Report the table verbatim. For every FAIL, inspect the live DOM to find what Reddit renamed, and propose the exact change to `content.js` or `content.css`. Stop there; Joe decides whether to apply it.

If a chrome-devtools call hangs for 120s, a renderer is pegged: find the `Google Chrome Helper (Renderer)` process with the highest CPU, `kill` it, `TaskStop` the backgrounded call, then reload the page.
