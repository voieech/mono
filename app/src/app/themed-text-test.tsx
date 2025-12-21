import { useState } from "react";
import { Pressable, View, Text } from "react-native";

import { SafeScrollViewContainer, ThemedText } from "@/components";
import { Colors } from "@/constants";

const ThemedTextTypesBySize = [
  "xl-black",
  "xl-bold",
  "xl-semibold",
  "xl-normal",
  "xl-light",
  "xl-thin",
  "lg-black",
  "lg-bold",
  "lg-semibold",
  "lg-normal",
  "lg-light",
  "lg-thin",
  "base-black",
  "base-bold",
  "base-semibold",
  "base-normal",
  "base-light",
  "base-thin",
  "sm-black",
  "sm-bold",
  "sm-semibold",
  "sm-normal",
  "sm-light",
  "sm-thin",
  "xs-black",
  "xs-bold",
  "xs-semibold",
  "xs-normal",
  "xs-light",
  "xs-thin",
];
const ThemedTextTypesByWeight = [
  "xl-black",
  "lg-black",
  "base-black",
  "sm-black",
  "xs-black",
  "xl-bold",
  "lg-bold",
  "base-bold",
  "sm-bold",
  "xs-bold",
  "xl-semibold",
  "lg-semibold",
  "base-semibold",
  "sm-semibold",
  "xs-semibold",
  "xl-normal",
  "lg-normal",
  "base-normal",
  "sm-normal",
  "xs-normal",
  "xl-light",
  "lg-light",
  "base-light",
  "sm-light",
  "xs-light",
  "xl-thin",
  "lg-thin",
  "base-thin",
  "sm-thin",
  "xs-thin",
];

export default function ThemedTextTest() {
  const [textType, setTextType] = useState<"size" | "weight">("size");
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 20,
          width: "100%",
        }}
      >
        <Pressable
          onPress={() => setTextType("size")}
          style={{
            width: "50%",
          }}
        >
          <View
            style={{
              backgroundColor: textType === "size" ? "lightgreen" : "white",
              borderWidth: 0.5,
              borderRadius: 16,
              paddingVertical: 8,
              paddingHorizontal: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                width: "100%",
              }}
            >
              By Size
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => setTextType("weight")}
          style={{
            width: "50%",
          }}
        >
          <View
            style={{
              backgroundColor: textType === "weight" ? "lightgreen" : "white",
              borderWidth: 0.5,
              borderRadius: 16,
              paddingVertical: 8,
              paddingHorizontal: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                width: "100%",
              }}
            >
              By Weight
            </Text>
          </View>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        {textType === "size" ? (
          <ThemedTextTestViewer types={ThemedTextTypesBySize} />
        ) : (
          <ThemedTextTestViewer types={ThemedTextTypesByWeight} />
        )}
      </View>
    </View>
  );
}

function ThemedTextTestViewer(props: { types: Array<string> }) {
  return (
    <SafeScrollViewContainer>
      <View
        style={{
          flex: 1,
          padding: 16,
          flexDirection: "column",
          rowGap: 20,
        }}
      >
        {props.types.map((type, index) => (
          <View key={index}>
            <Text
              style={{
                color: Colors.neutral50,
                fontSize: 20,
                paddingBottom: 4,
              }}
            >
              {type}
            </Text>
            <View
              style={{
                borderWidth: 0.5,
                borderRadius: 8,
                borderColor: "gray",
                padding: 16,
              }}
            >
              <ThemedText type={type as any}>Testing 123 test.</ThemedText>
            </View>
          </View>
        ))}
      </View>
    </SafeScrollViewContainer>
  );
}
