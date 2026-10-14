// Compatibility check for Clean Feed for Reddit.
//
// Run this in the DevTools console on a LOGGED-IN reddit.com home feed
// (https://www.reddit.com/), with or without the extension installed. It reports
// whether each piece of Reddit markup the extension relies on is still present.
// Rows marked FAIL mean the extension has stopped working and content.js or
// content.css needs updating; see "What the extension relies on" in README.md.

(() => {
  const results = [];
  const check = (name, ok, detail) => results.push({ check: name, result: ok ? 'PASS' : 'FAIL', detail });
  const warn = (name, ok, detail) => results.push({ check: name, result: ok ? 'PASS' : 'WARN', detail });

  const app = document.querySelector('shreddit-app');
  const feed = document.querySelector('shreddit-feed');
  const posts = [...document.querySelectorAll('shreddit-feed shreddit-post')];
  const subscribed = posts.filter((p) => p.hasAttribute('is-subscribed'));
  const ads = document.querySelectorAll('shreddit-ad-post');
  const reloadUrl = feed?.getAttribute('reload-url') || '';
  const hiddenAttr = document.documentElement.dataset.cleanRedditHidden;

  const loggedIn = app?.getAttribute('user-logged-in') === 'true';
  check('shreddit-app[user-logged-in="true"]', loggedIn,
    !app ? 'no <shreddit-app> element: Reddit has changed its front end' : loggedIn ? 'logged in' : 'not logged in: log in, then rerun');
  check('shreddit-feed[reload-url] names the feed type', /home-feed|community-more-posts|popular-feed/.test(reloadUrl),
    reloadUrl || 'no reload-url on <shreddit-feed>');
  check('feed items are <article> or <shreddit-post> children of <shreddit-feed>',
    document.querySelectorAll('shreddit-feed > article, shreddit-feed > shreddit-post').length > 0,
    `${posts.length} posts found`);
  check('posts from joined communities carry is-subscribed', reloadUrl.includes('home-feed') ? subscribed.length > 0 : posts.length > 0,
    reloadUrl.includes('home-feed') ? `${subscribed.length} of ${posts.length} posts have is-subscribed` : 'not on the home feed: open https://www.reddit.com/ to test this');
  check('posts carry subreddit-name', posts.length > 0 && posts.every((p) => p.hasAttribute('subreddit-name')),
    `${posts.filter((p) => p.hasAttribute('subreddit-name')).length} of ${posts.length}`);
  warn('ads render as <shreddit-ad-post>', ads.length > 0,
    ads.length ? `${ads.length} found${[...ads].some((a) => a.offsetParent !== null) ? ', and at least one is VISIBLE: the stylesheet is not hiding them' : ', all hidden'}` : 'none on this page load; reload or scroll and rerun');
  warn('extension is installed and running', hiddenAttr !== undefined,
    hiddenAttr !== undefined ? `${hiddenAttr} suggested posts hidden on this page` : 'no data-clean-reddit-hidden on <html>: extension not loaded on this tab');
  if (hiddenAttr !== undefined && reloadUrl.includes('home-feed') && subscribed.length > 0) {
    const leaked = posts.filter((p) => !p.hasAttribute('is-subscribed') && p.closest('article')?.offsetParent !== null);
    check('no unjoined-community posts are visible on the home feed', leaked.length === 0,
      leaked.length ? leaked.slice(0, 5).map((p) => p.getAttribute('subreddit-prefixed-name')).join(', ') : 'none visible');
  }

  console.table(results);
  const fails = results.filter((r) => r.result === 'FAIL').length;
  console.log(fails ? `${fails} check(s) FAILED: the extension needs updating.` : 'All checks passed.');
  return results;
})();
