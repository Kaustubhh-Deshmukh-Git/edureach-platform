import {
  initializeKnowledgeBase,
  getRAGResponse,
  closeRagConnections,
} from "../src/services/rag.service.ts";

async function main(): Promise<void> {
  console.log("========================================");
  console.log("   EduReach RAG Pipeline Smoke Test    ");
  console.log("========================================\n");

  console.log("▶ Step 1: Initializing Knowledge Base...");
  const initResult = await initializeKnowledgeBase();
  console.log("✔ Knowledge Base Initialization Complete:", initResult);

  console.log("\n▶ Step 2: Asking Campus Fact Query...");
  const question1 = "What is the B.Tech CSE tuition fee?";
  console.log(`Question: "${question1}"`);
  const response1 = await getRAGResponse(question1);
  console.log("\n--- Response 1 ---");
  console.log(response1);
  console.log("------------------\n");

  console.log("▶ Step 3: Asking Off-Topic Query...");
  const question2 = "Who won the 2022 World Cup?";
  console.log(`Question: "${question2}"`);
  const response2 = await getRAGResponse(question2);
  console.log("\n--- Response 2 ---");
  console.log(response2);
  console.log("------------------\n");

  await closeRagConnections();
  console.log("✔ RAG connections closed. Smoke test complete.");
  process.exit(0);
}

main().catch(async (error: unknown) => {
  console.error("❌ RAG smoke test failed with error:", error);
  try {
    await closeRagConnections();
  } catch {
    // ignore secondary errors during shutdown
  }
  process.exit(1);
});
