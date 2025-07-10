export const signupLink = "";

export const appSlug = "voieech";

export const createAppLink = {
  base() {
    return `${appSlug}://`;
  },
  forPodcastChannel(channelID: string) {
    return `${appSlug}://podcast/channel/${channelID}`;
  },
  forPodcastEpisode(vanityID: string) {
    return `${appSlug}://podcast/episode/${vanityID}`;
  },
};
