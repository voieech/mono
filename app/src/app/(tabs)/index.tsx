import { Redirect } from "expo-router";

/**
 * Empty route page that just redirects to (home)/index.tsx, since the order of
 * default page route open is determined by alphabetical order if this index
 * page is available.
 */
export default function TabIndex() {
  return (
    <Redirect
      href={{
        pathname: "/(tabs)/(home)",
      }}
    />
  );
}
