import { config } from "dotenv";
import { queryRAG } from "./rag.js";

config(); // Load environment variables

const runTest = async () => {
  const testQuery = "Untuk lomba storytelling, kapan pengumpulan videonya?"; // Replace with something from your PDF
  try {
    const { result, sources } = await queryRAG(testQuery);
    console.log("RAG Response:\n", result);
    console.log("Sources:\n", sources? sources[0] : 'Dari Gemini');
  } catch (err) {
    console.error("Error during RAG test:", err);
  }
};

runTest();
