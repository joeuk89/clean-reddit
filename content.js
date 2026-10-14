(() => {
  const HIDDEN_CLASS = 'clean-reddit-hidden';
  const FEED_ITEM_SELECTOR = 'shreddit-feed > article, shreddit-feed > shreddit-post';

  const isLoggedIn = () =>
    document.querySelector('shreddit-app')?.getAttribute('user-logged-in') === 'true';

  // The feed element's reload-url names the feed type:
  //   /svc/shreddit/feeds/interest-home-feed?feed=for-you      home (For You / Following)
  //   /svc/shreddit/community-more-posts/hot/?name=london      a subreddit
  //   /svc/shreddit/feeds/popular-feed?sort=BEST               r/popular, r/all, custom feeds
  const feedKind = (feed) => {
    const reloadUrl = feed.getAttribute('reload-url') || '';
    if (reloadUrl.includes('home-feed')) return { kind: 'home' };
    const subreddit = reloadUrl.match(/community-more-posts\/.*[?&]name=([^&]+)/)?.[1];
    if (subreddit) return { kind: 'subreddit', subreddit: decodeURIComponent(subreddit).toLowerCase() };
    return { kind: 'other' };
  };

  const isPromoted = (post) =>
    post.tagName === 'SHREDDIT-AD-POST' || post.hasAttribute('promoted');

  // A suggested post is one Reddit put in a feed it does not belong to: a post
  // from an unjoined community on the home feed, or a post from another
  // community on a subreddit page. On r/popular and r/all every post is from an
  // unjoined community by design, so only ads are hidden there.
  const isSuggested = (post, feed) => {
    const { kind, subreddit } = feedKind(feed);
    if (kind === 'home') return isLoggedIn() && !post.hasAttribute('is-subscribed');
    if (kind === 'subreddit') return (post.getAttribute('subreddit-name') || '').toLowerCase() !== subreddit;
    return false;
  };

  // Status is published on <html> so the compatibility check, which runs in the
  // page's own world, can read it. Extension globals are invisible there.
  let hiddenCount = 0;
  const publishStatus = () => {
    document.documentElement.dataset.cleanRedditHidden = String(hiddenCount);
  };

  const classify = (item) => {
    if (!item.matches?.(FEED_ITEM_SELECTOR)) return;
    const feed = item.parentElement;
    const post = item.tagName === 'SHREDDIT-POST' ? item : item.querySelector('shreddit-post, shreddit-ad-post');
    if (!feed || !post) return;
    const hide = isPromoted(post) || isSuggested(post, feed);
    if (hide && !item.classList.contains(HIDDEN_CLASS)) {
      hiddenCount += 1;
      publishStatus();
    }
    item.classList.toggle(HIDDEN_CLASS, hide);
  };

  const sweep = (root) => {
    if (root.matches?.(FEED_ITEM_SELECTOR)) classify(root);
    root.querySelectorAll?.(FEED_ITEM_SELECTOR).forEach(classify);
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) sweep(node);
      }
      // Reddit can render a post before it sets the post's attributes.
      if (mutation.type === 'attributes') {
        const target = mutation.target;
        if (target.tagName === 'SHREDDIT-FEED') sweep(target);
        else classify(target.closest?.(FEED_ITEM_SELECTOR) ?? target);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['is-subscribed', 'promoted', 'subreddit-name', 'reload-url'],
  });

  sweep(document.documentElement);
  publishStatus();
})();
