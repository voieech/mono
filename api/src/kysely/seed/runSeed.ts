import "../../global/bootstrapGlobalDefinitions.js";
import { createDB } from "../createDB.js";

async function runSeed() {
  // @todo just like migration CLI, this one should ask to confirm first before allowing you to run!

  const apiDB = createDB({
    connectionString: process.env["DATABASE_URL"]!,
  });

  await apiDB
    .insertInto("podcast_channel")
    .values({
      id: "7051547f-b765-4c55-b1c7-c6ea0c472db0",
      created_at: $DateTime.ISO.DateTime.makeStrongAndThrowOnError(
        "2025-06-05T00:19:24.776Z",
      ),
      name: "Byte Sized News",
      description: "Daily tech news",
      language: "en",
      img_url:
        "https://voieechcontent.sgp1.cdn.digitaloceanspaces.com/podcast_channel_image/7051547f-b765-4c55-b1c7-c6ea0c472db0.png",
      category_primary: "News",
      subcategory_primary: "Daily News",
      category_secondary: "Technology",
    })
    .execute();

  await apiDB
    .insertInto("audio")
    .values({
      id: "30370196-f72e-473d-a5a1-a66ce4f4af80",
      created_at: $DateTime.ISO.DateTime.makeStrongAndThrowOnError(
        "2025-06-05T00:20:44.559Z",
      ),
      language: "en",
      public_url:
        "https://voieechcontent.sgp1.cdn.digitaloceanspaces.com/channels/voieech_daily_tech/20250604_151541_k3ivi.mp3",
      length: 601,
      ai_model: "openai",
      name: "test",
      mime_type: "audio/mpeg",
      size: 3606561,
    })
    .execute();

  await apiDB
    .insertInto("podcast_episode")
    .values({
      id: "7051547f-b765-4c55-b1c7-c6ea0c472db2",
      created_at: $DateTime.ISO.DateTime.makeStrongAndThrowOnError(
        "2025-06-05T00:20:44.559Z",
      ),
      vanity_id: "test",
      language: "en",
      season_number: 1,
      episode_number: 1,
      title:
        "Perplexity AI's $14B Surge, Google's AI Coding Assistant, Qualcomm-Alphawave Bid Extension, CATL's $4B IPO & Amazon-FedEx Delivery Deal",
      description:
        "Today's episode covers five compelling tech developments shaping the industry's future. First, Perplexity AI is racing toward a $14 billion valuation with a $500 million funding round led by Accel, as it pushes conversational search tools closer to mainstream adoption. Next, Google is preparing to unveil an AI-powered software assistant designed to help developers streamline coding and project management, ahead of its upcoming I/O conference. We then explore the extended deadline for Qualcomm's bid to acquire British semiconductor firm Alphawave IP Group, highlighting the ongoing high-stakes negotiations. Following that, Chinese battery manufacturer CATL is set for the largest global IPO of 2025, raising $4 billion in Hong Kong to support its expansion in Europe's electric vehicle market. Finally, we examine the new logistics landscape as Amazon partners with FedEx for large package deliveries in the wake of UPS's significant job cuts and service reductions.",
      audio_id: "30370196-f72e-473d-a5a1-a66ce4f4af80",
      channel_id: "7051547f-b765-4c55-b1c7-c6ea0c472db0",
      img_url:
        "https://voieechcontent.sgp1.cdn.digitaloceanspaces.com/podcast_channel_image/7051547f-b765-4c55-b1c7-c6ea0c472db0.png",
    })
    .execute();

  await apiDB.destroy();

  // eslint-disable-next-line no-console
  console.log("Database seeding completed");
}

runSeed();
