import { envVar } from "./envVar";

export const supportFormLinkPrefillContent = (content: string) =>
  `${envVar.supportLinkPrefillable}=${encodeURIComponent(content)}`;
