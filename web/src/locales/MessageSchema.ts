import type { DeepPartial } from "../types/DeepPartial";
import type en from "./en";

// Type-define 'en' as the master schema for the resource
export type MessageSchema = DeepPartial<typeof en>;
