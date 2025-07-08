export const signupLink = "";

export const appLink = "";

export const createAppLink = {
  forPodcastChannel(channelID: string) {
    return `voieech://podcast/channel/${channelID}`;
  },
  forPodcastEpisode(vanityID: string) {
    return `voieech://podcast/episode/${vanityID}`;
  },
};
