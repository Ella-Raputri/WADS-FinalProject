import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { config } from "dotenv";

config();

const embedding = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY
});

const loadDocument = async () => {
    const loader = new PDFLoader("files/FAQ_NMC_Indonesia_2024.pdf");
    return await loader.load();
};

const splitDocs = async (documents) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 80,
    });
    return await textSplitter.splitDocuments(documents);
};

const calculateChunkIds = (chunks) => {
    let lastPageId = null;
    let currentChunkIndex = 0;

    return chunks.map(chunk => {
        const source = chunk.metadata.source || "faq";
        const page = chunk.metadata.page || 0;
        const currentPageId = `${source}:${page}`;

        if (currentPageId === lastPageId) {
            currentChunkIndex += 1;
        } else {
            currentChunkIndex = 0;
        }

        const chunkId = `${currentPageId}:${currentChunkIndex}`;
        chunk.metadata.id = chunkId;
        lastPageId = currentPageId;
        return chunk;
    });
};

const saveToPinecone = async () => {
    const pinecone = new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY,
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

    const documents = await loadDocument();
    const splits = await splitDocs(documents);
    const chunksWithIds = calculateChunkIds(splits);

    const vectorStore = await PineconeStore.fromExistingIndex(embedding, {
        pineconeIndex,
    });

    await vectorStore.addDocuments(chunksWithIds, {
        ids: chunksWithIds.map(chunk => chunk.metadata.id),
    });

    console.log("Document vectors added to Pinecone!");
};

saveToPinecone();
