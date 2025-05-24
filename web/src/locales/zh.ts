import type { MessageSchema } from "./MessageSchema";

export default {
  common: {
    loading: "加载中",
  },

  PlatformName: {
    himalaya: "喜马拉雅",
  },

  SingleEpisode: {
    loadingEpisode: "加载播客中",
    episodeNumber: "第{episodeNumber}集",
    mins: "分钟",
    PodcastPlatforms: "播客平台",
    ReadMore: "跟多",
    Hide: "隐藏",

    WebPlayer: {
      name: "Voieech 网络播放器",
      preferred: "推荐",
      Control: "控制",
      SkipBackward: "跳回几秒",
      SkipForward: "跳前几秒",
      Reset: "复位",
      Speed: "数度",
      SpeedUp: "加速",
      SlowDown: "减速",
    },
  },
} satisfies MessageSchema;
