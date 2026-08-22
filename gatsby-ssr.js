/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from 'react';

// Le provider i18n doit être posé à l'identique côté SSR et côté navigateur, sans
// quoi l'hydratation divergerait du HTML rendu.
export { wrapPageElement } from './src/i18n/wrapPageElement';

// Umami analytics — self-hosted, cookieless, no consent banner needed.
//
// The tracker is served first-party from this site's own origin (/s.js for the
// script, /api/s for the collect endpoint). Traefik routes those two paths to
// the Umami pod, so from the browser's point of view they are same-origin
// requests to the site being visited — nothing an ad blocker can cut without
// breaking the site itself.
//
// GATSBY_UMAMI_WEBSITE_ID is baked in at build time (Gatsby inlines GATSBY_*
// variables into the static output), so `gatsby develop` stays out of the stats
// as long as the variable is left unset locally.
//
// GATSBY_UMAMI_HOST_URL is an escape hatch. The tracker builds its collect URL
// from the data-host-url attribute, falling back to a value baked into the
// script at build time — not to the origin the script was served from. If the
// self-hosted tracker turns out to bake in an absolute URL, set this to "/" so
// the collect request stays relative, and therefore first-party.
export const onRenderBody = ({ setHeadComponents }) => {
  const websiteId = process.env.GATSBY_UMAMI_WEBSITE_ID;

  if (!websiteId) {
    return;
  }

  const domains = process.env.GATSBY_UMAMI_DOMAINS;
  const hostUrl = process.env.GATSBY_UMAMI_HOST_URL;

  setHeadComponents([
    <script
      key="umami"
      defer
      src="/s.js"
      data-website-id={websiteId}
      {...(domains ? { 'data-domains': domains } : {})}
      {...(hostUrl ? { 'data-host-url': hostUrl } : {})}
    />,
  ]);
};
