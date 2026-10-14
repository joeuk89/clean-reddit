# Clean Feed for Reddit

Chrome extension that hides two kinds of post wherever Reddit shows a list of posts:

- **Promoted posts** (ads styled to look like normal posts), in every feed and in the sidebar.
- **Suggested posts**: on the home feed (both the "For You" and "Following" tabs), any post from a community you
  have not joined; on a subreddit page, any post from a different community, plus the "Suggested communities" block.

On r/popular and r/all every post is from a community you have not joined by design, so only ads are hidden there.

The extension asks for no permissions beyond running on reddit.com, collects nothing and sends nothing anywhere.

## Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and choose this folder.
4. Reload any open Reddit tabs.

## How it works

The stylesheet hides ad elements outright. The content script hides feed items that count as suggested for the
feed type it is in, and watches the page so posts loaded by infinite scroll and tab switches are handled too.

### What the extension relies on

Reddit's front end ("shreddit") marks up its feeds with custom elements and attributes. These are the ones the
extension depends on. If Reddit renames any of them the extension stops hiding the matching content.

| Marker | Used for |
| --- | --- |
| `<shreddit-ad-post>`, `<shreddit-sidebar-ad>`, `<shreddit-dynamic-ad-link>`, `<shreddit-comments-page-ad>` | ads, hidden by `content.css` |
| `<in-feed-community-recommendations>` | "Suggested communities" block, hidden by `content.css` |
| `<shreddit-feed>` with child `<article>` items | the list of posts |
| `shreddit-feed[reload-url]` containing `home-feed`, `community-more-posts/...?name=X` or `popular-feed` | which kind of feed this is |
| `shreddit-post[is-subscribed]` | post is from a community you have joined |
| `shreddit-post[subreddit-name]` | which community a post belongs to |
| `shreddit-app[user-logged-in="true"]` | you are logged in, so the subscription rule applies |

## Compatibility check

Reddit changes its markup without notice. `compat-check.js` tests every marker in the table above against the live
site and prints a PASS / WARN / FAIL table.

Run it by hand:

1. Log in to Reddit and open `https://www.reddit.com/`.
2. Open DevTools (Cmd+Option+J), paste the contents of `compat-check.js` into the console and press Enter.

Or run it with Claude Code from this folder with `/reddit-compat`, which drives a browser, waits for you to log in,
runs the script and proposes fixes for any FAIL.

To check the extension is active on a tab, run this in the console. It returns the number of suggested posts
hidden so far (ads are hidden by the stylesheet and are not counted):

```js
document.documentElement.dataset.cleanRedditHidden
```
