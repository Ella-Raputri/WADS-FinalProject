import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { config } from "dotenv";

config();

// embedding from OpenAI to convert text to vector embeddings
const embedding = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY
});

// load the FAQ pdf document
const loadDocument = async () => {
    const loader = new PDFLoader("files/FAQ_NMC_Indonesia_2024.pdf");
    return await loader.load();
};

// split the document into several chunks
const splitDocs = async (documents) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 80,
    });
    return await textSplitter.splitDocuments(documents);
};

// calculate the chunk Ids
const calculateChunkIds = (chunks) => {
    let lastPageId = null;
    let currentChunkIndex = 0;

    return chunks.map(chunk => {
        // get the source and page of the chunk to create the id
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

// save the vector embeddings to pinecone
const saveToPinecone = async () => {
    const pinecone = new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY,
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

    // load the documents, split it into chunks
    const documents = await loadDocument();
    const splits = await splitDocs(documents);
    const chunksWithIds = calculateChunkIds(splits);

    // store the vector embeddings into pinecone
    const vectorStore = await PineconeStore.fromExistingIndex(embedding, {
        pineconeIndex,
    });

    await vectorStore.addDocuments(chunksWithIds, {
        ids: chunksWithIds.map(chunk => chunk.metadata.id),
    });

    console.log("Document vectors added to Pinecone!");
};

saveToPinecone();
