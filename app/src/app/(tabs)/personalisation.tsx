import { SafeScrollViewContainer } from "@/components/PageContainer";
import { ThemedText } from "@/components/ThemedText";

export default function TabTwoScreen() {
  return (
    <SafeScrollViewContainer>
      <ThemedText type="title">For You</ThemedText>
      <ThemedText>Personalised content just for you</ThemedText>
    </SafeScrollViewContainer>
  );
}
