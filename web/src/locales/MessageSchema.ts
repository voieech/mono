import type { DeepPartial } from "../types/DeepPartial";
import type en from "./en";

// Type-define 'en' as the master schema for the resource
export type MessageSchema = DeepPartial<typeof en>;

type FullMessageSchema = typeof en;

declare module "vue-i18n" {
  // Extend this to get generic TS based hints for the `$t` function args.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DefineLocaleMessage extends FullMessageSchema {}
}
