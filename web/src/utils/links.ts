export const signupLink = "";

export const appSlug = "voieech";

export const createAppLink = {
  forPodcastChannel(channelID: string) {
    return `${appSlug}://podcast/channel/${channelID}`;
  },
  forPodcastEpisode(vanityID: string) {
    return `${appSlug}://podcast/episode/${vanityID}`;
  },
};
