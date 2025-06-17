import { SimplerFetch } from "simpler-fetch";

import { apiBaseUrl } from "./api";

export const sf = new SimplerFetch({
  baseUrlConfigs: {
    v1: {
      url: `${apiBaseUrl}/v1`,
    },
  },
});
