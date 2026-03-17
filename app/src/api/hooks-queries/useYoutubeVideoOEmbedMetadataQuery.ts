import { useQuery } from "@tanstack/react-query";

import { queryKeyBuilder, getResError } from "@/api-client";

export function useYoutubeVideoOEmbedMetadataQuery(youtubeVideoID?: string) {
  return useQuery({
    enabled: youtubeVideoID !== undefined,
    queryKey: queryKeyBuilder.fullPath(
      "create.youtube-video-summary.youtubeVideoID.$youtubeVideoID",
      { youtubeVideoID },
    ),
    async queryFn() {
      const youtubeVideoLink = `https://www.youtube.com/watch?v=${youtubeVideoID}`;
      const youtubeOEmbedLink = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeVideoLink)}&format=json`;
      const res = await fetch(youtubeOEmbedLink);

      if (!res.ok) {
        throw await getResError({
          res,
          defaultErrorMessage: `Failed to load Youtube Video OEmbed data: ${youtubeOEmbedLink}`,
          logError: true,
        });
      }

      return (await res.json()) as {
        title: string;
        author_name: string;
        author_url: string;
        type: string;
        height: number;
        width: number;
        version: "1.0" | string;
        provider_name: "YouTube";
        provider_url: "https://www.youtube.com/";
        thumbnail_height: number;
        thumbnail_width: number;
        thumbnail_url: string;
        html: string;
      };
    },
  });
}
