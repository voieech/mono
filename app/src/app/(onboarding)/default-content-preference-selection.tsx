import { Trans } from "@lingui/react/macro";
import { useState } from "react";
import { View, Pressable, ScrollView, useWindowDimensions } from "react-native";

import {
  SafeAreaViewContainer,
  ScrollViewContainer,
  ThemedText,
} from "@/components";
import { Colors } from "@/constants";
import { useSettingContext } from "@/context";
import { useBottomTabOverflow } from "@/hooks";

interface Tag {
  id: string;
  name: string;
}

interface Category {
  id: string;
  title: string;
  tags: Array<Tag>;
}

const CATEGORIES: Array<Category> = [
  // @todo Could be dynamically loaded from API
  {
    id: "technology",
    title: "Technology",
    tags: [
      { id: "7557a16c-7108-470d-b1cb-bd6a4fea4ecc", name: "AI" },
      { id: "fa90bc11-aecd-452b-bf2b-03b822ffcaab", name: "Programming" },
      { id: "035cc6ed-0f97-4bbd-b010-3db2c8feeb84", name: "Web Development" },
      { id: "0e55f9f5-1b9e-4965-88a9-38b94efd566f", name: "Mobile Apps" },
      { id: "0ca9724e-44be-4a7d-8060-887213a22438", name: "Cybersecurity" },
    ],
  },
  {
    id: "entertainment",
    title: "Entertainment",
    tags: [
      { id: "13e44a7f-a046-4cc5-8226-eef5491daa00", name: "Movies" },
      { id: "29014553-8938-413e-b6b3-79dea212b6fd", name: "Music" },
      { id: "ee18abd5-503a-42d8-bc0f-37b9e2aad92a", name: "Gaming" },
      { id: "a22eaaed-fcd7-4573-a60c-0c54b9429da8", name: "Streaming" },
      { id: "49497a44-ba01-421c-8106-b616fc310c1a", name: "Books" },
    ],
  },
  {
    id: "sports",
    title: "Sports",
    tags: [
      { id: "1df125d5-c01a-4cc0-a9ed-22047bb6de0e", name: "Football" },
      { id: "e5fe17f6-60cf-4385-ae95-ef11752f48d4", name: "Basketball" },
      { id: "d1f0964d-e111-4cf0-838a-67726cbbc247", name: "Tennis" },
      { id: "e76270cb-a688-43b5-ae12-e46ec31c3250", name: "Fitness" },
      { id: "726bb6ce-7b30-4ce0-82f7-aa631a2ec229", name: "Yoga" },
    ],
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    tags: [
      { id: "d23335d7-9372-4c8f-9323-9b41c22b30ba", name: "Travel" },
      { id: "8141fe97-0684-4a25-ba44-8c1bc75ea7b1", name: "Food" },
      { id: "93cdc093-f8ee-4f6e-ac93-882640e5e24c", name: "Fashion" },
      { id: "e93f97bf-f6b0-4a50-8fa5-52b733e9c6ba", name: "Health" },
      { id: "8e1d45bf-f01b-4d38-ac32-9468a5d858c1", name: "Home" },
    ],
  },
];

export default function DefaultContentPreferenceSelection() {
  const windowDimensions = useWindowDimensions();
  const bottomOverflow = useBottomTabOverflow();
  const padding = 16;
  const floatingButtonPaddingBottom =
    (bottomOverflow > padding ? bottomOverflow : padding) + 16;

  const _settingContext = useSettingContext();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const hasSelectedTags = selectedTags.size < 1;

  function toggleTag(tagID: string) {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tagID)) {
      newSelectedTags.delete(tagID);
    } else {
      newSelectedTags.add(tagID);
    }
    setSelectedTags(newSelectedTags);
  }

  // @todo
  function saveAndNext() {
    // save the selection
    // move to next screen / do something else based on current context
  }

  return (
    <SafeAreaViewContainer>
      <ScrollViewContainer>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingVertical: 32,
          }}
        >
          <View
            style={{
              marginBottom: 32,
            }}
          >
            <ThemedText
              type="xl-bold"
              style={{
                paddingBottom: 8,
              }}
            >
              <Trans>What interests you?</Trans>
            </ThemedText>
            <ThemedText>
              <Trans>
                Select topics you like so that we can personalise your starting
                experience!
              </Trans>
            </ThemedText>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {CATEGORIES.map((category) => (
              <View
                key={category.id}
                style={{
                  paddingBottom: 24,
                }}
              >
                <ThemedText
                  type="base-semibold"
                  style={{
                    paddingBottom: 8,
                  }}
                >
                  {category.title}
                </ThemedText>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  {category.tags.map((tag) => {
                    const isSelected = selectedTags.has(tag.id);
                    return (
                      <Pressable
                        key={tag.id}
                        onPress={() => toggleTag(tag.id)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 6,
                          borderRadius: 20,
                          backgroundColor: isSelected
                            ? Colors.blue500
                            : Colors.neutral50,
                        }}
                      >
                        <ThemedText
                          style={{
                            color: isSelected ? Colors.white : Colors.gray800,
                          }}
                        >
                          {tag.name}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollViewContainer>
      <View
        style={{
          flex: 1,
          position: "absolute",
          bottom: floatingButtonPaddingBottom,
          width: "100%",
          paddingHorizontal: windowDimensions.width * 0.1,
        }}
      >
        <Pressable
          style={{
            backgroundColor: hasSelectedTags ? Colors.gray400 : Colors.blue600,
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={saveAndNext}
          disabled={hasSelectedTags}
        >
          <ThemedText type="lg-light">
            <Trans>Save</Trans>
          </ThemedText>
        </Pressable>
      </View>
    </SafeAreaViewContainer>
  );
}
