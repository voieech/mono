const envVars = [
  {
    key: "posthogApiKey",
    value: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  },
  {
    key: "contentSourceFeedbackLink",
    value: process.env.EXPO_PUBLIC_CONTENT_SOURCE_FEEDBACK_LINK,
  },
  {
    key: "supportLink",
    value: process.env.EXPO_PUBLIC_SUPPORT_LINK,
  },
  {
    key: "supportLinkPrefillable",
    value: process.env.EXPO_PUBLIC_SUPPORT_LINK_PREFILLABLE,
  },
] as const;

type EnvVarKey = (typeof envVars)[number]["key"];
type ConfigObject = {
  [K in EnvVarKey]: string;
};

/**
 * List of validated Env Var strings, this will error out at top level and kill
 * the process if not available!
 */
export const envVar = envVars.reduce((acc, curr) => {
  if (curr.value === undefined) {
    throw new Error(`Missing config value for: ${curr.key}`);
  }
  acc[curr.key] = curr.value;
  return acc;
}, {} as ConfigObject);
