export const signupLink = "";

export const appSlug = "voieech";

export const createAppLink = {
  base() {
    return `${appSlug}://`;
  },
  forPodcastChannel(channelID: string) {
    return `${appSlug}://podcast/channel/${channelID}`;
  },
  forPodcastEpisode(episodeID: string) {
    return `${appSlug}://podcast/episode/${episodeID}`;
  },
};
