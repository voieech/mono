import { Trans, useLingui } from "@lingui/react/macro";
import { useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import {
  Icon,
  ThemedText,
  FrontPageLayoutTopBarWithProfilePic,
  ScrollViewContainer,
  SafeAreaViewContainer,
  VerticalSpacer,
} from "@/components";
import { Colors } from "@/constants";

export default function SearchTabHomeScreen() {
  const { t } = useLingui();
  const searchInputBoxRef = useRef<TextInput>(null);
  const [searchInput, setSearchInput] = useState("");

  return (
    <SafeAreaViewContainer>
      <FrontPageLayoutTopBarWithProfilePic>
        <ThemedText type="lg-light">
          <Trans>Search</Trans>
        </ThemedText>
      </FrontPageLayoutTopBarWithProfilePic>
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}
      >
        <Pressable onPress={() => searchInputBoxRef.current?.focus?.()}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              borderRadius: 4,
              backgroundColor: Colors.neutral200,
              width: "100%",
              columnGap: 8,
            }}
          >
            <Icon name="magnifyingglass" color={Colors.neutral700} />
            <TextInput
              ref={searchInputBoxRef}
              value={searchInput}
              onChangeText={setSearchInput}
              placeholder={t`What are you looking for?`}
              placeholderTextColor={Colors.neutral700}
              onSubmitEditing={() => {
                console.log("Searched!", searchInput);
              }}
              style={{
                flex: 1,
                fontSize: 20,
                color: Colors.neutral900,

                // Prevents extra padding on Android
                paddingVertical: 0,
              }}
            />
            {searchInput.length !== 0 && (
              <Pressable
                onPress={(e) => {
                  e.preventDefault();
                  setSearchInput("");
                  searchInputBoxRef.current?.focus?.();
                }}
              >
                <Icon name="multiply" color={Colors.neutral700} />
              </Pressable>
            )}
          </View>
        </Pressable>
      </View>
      <ScrollViewContainer
      // @todo Implement refresh control for new explore items
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
      >
        {/* @todo When there is no search results, show user explore page or default featured content */}
        {/* <AuthenticatedUsersOnly>
          <UserExplorePage />
        </AuthenticatedUsersOnly> */}
        <VerticalSpacer />
      </ScrollViewContainer>
    </SafeAreaViewContainer>
  );
}
