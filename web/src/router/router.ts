import type { RouteLocationNormalized } from "vue-router";

import { createRouter, createWebHistory } from "vue-router";

import { i18n, setLocale } from "../i18n";

export const PodcastEpisodeRoute = <const>{
  path: "/podcast/episode/:vanityID",
  name: "podcast-episode",
  props: (route: RouteLocationNormalized) => route.query,
  component: () => import("../views/PodcastEpisode/PodcastEpisode.vue"),
};

export const PodcastChannelRoute = <const>{
  path: "/podcast/channel/:channelID",
  name: "podcast-channel",
  props: (route: RouteLocationNormalized) => route.query,
  component: () => import("../views/PodcastChannel/PodcastChannel.vue"),
};

export const PodcastChannelEpisodesRoute = <const>{
  path: "/podcast/channel/episodes/:channelID",
  name: "podcast-channel-episodes",
  props: (route: RouteLocationNormalized) => route.query,
  component: () =>
    import("../views/PodcastChannelEpisodes/PodcastChannelEpisodes.vue"),
};

export const HomeRoute = <const>{
  path: "/",
  name: "home",
  props: (route: RouteLocationNormalized) => route.query,
  component: () => import("../views/Home/HomeView.vue"),
};

export const AboutRoute = <const>{
  path: "/about",
  name: "about",
  props: (route: RouteLocationNormalized) => route.query,
  component: () => import("../views/Home/HomeView.vue"),
};

export const ContactRoute = <const>{
  path: "/contact",
  name: "contact",
  props: (route: RouteLocationNormalized) => route.query,
  component: () => import("../views/Home/HomeView.vue"),
};

// @todo Do something like https://bio.link/llamatechtrends
export const LinkInBioRoute = <const>{
  path: "/links",
  name: "linkinbio",
  props: (route: RouteLocationNormalized) => route.query,
  component: () => import("../views/Home/HomeView.vue"),
};

export const NotFoundRoute = <const>{
  path: "/:pathMatch(.*)*",
  name: "404",
  component: () => import("../views/NotFound.vue"),
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  // Always scroll to top of view on first visit and no savedPosition, else
  // reuse savedPosition
  scrollBehavior: (_to, _from, savedPosition) =>
    savedPosition !== null ? savedPosition : { top: 0 },

  routes: [
    PodcastEpisodeRoute,
    PodcastChannelRoute,
    PodcastChannelEpisodesRoute,
    HomeRoute,
    AboutRoute,
    ContactRoute,
    LinkInBioRoute,
    NotFoundRoute,
  ],
});

// Handle locale/lang query params
router.beforeEach((to) => {
  const localeQueryParam =
    to.query.locale?.toString() ?? to.query.lang?.toString();

  // Do nothing if no locale is set in URL
  if (localeQueryParam === undefined) {
    return;
  }

  // Set it if it is a valid locale
  if (
    i18n.global.availableLocales.some(
      (availableLocale) => availableLocale === localeQueryParam,
    )
  ) {
    setLocale(localeQueryParam);
    return;
  }

  // If it is a full locale, and same language is found, set to that language
  const availableSameLanguage = i18n.global.availableLocales.find(
    (availableLocale) => localeQueryParam.startsWith(availableLocale),
  );
  if (availableSameLanguage !== undefined) {
    setLocale(localeQueryParam);
    return;
  }

  // If it is not a supported locale and language, fallback to en
  // @todo Show snackbar to notify user about this change
  to.query.lang = "en";
  return to;
});

/**
 * This error handler is called every time a non caught error happens during
 * navigation, including errors thrown synchronously and asynchronously, errors
 * returned or passed to next in any navigation guard, and errors occurred when
 * trying to resolve an async component that is required to render a route.
 *
 * @todo
 * Once the error is caught, it is set on the reactive `routerError` which is
 * used by the root App.vue to show the error page instead of showing the
 * default loader screen indefinitely.
 *
 * @todo Add a APM tool like sentry or something
 */
router.onError((error, to) => {
  console.error("RouterError: ", error);

  // If error message specifies failed dynamic import of the Route's component,
  // assume that the error is caused by version drift/skew, where users are
  // still using the old version after a new version is deployed. Attempt to
  // solve it by reloading the page or triggering the browser to load the new
  // route directly by navigating there instead of loading it dynamically.
  //
  // Error messages are usually either "failed to fetch dynamically imported
  // module" or "TypeError: error loading dynamically imported module".
  if (
    error.message.lowercase().includes("importing a module script failed") ||
    error.message.lowercase().includes("dynamically imported module")
  ) {
    // The route might not have a full path, so reload page if not found.
    if (to?.fullPath) window.location.href = to.fullPath;
    else window.location.reload();
    return;
  }

  // @todo
  // If it is an unknown error, show user with <GlobalError> view.
  // routerError.value = error;
});

export { router };
