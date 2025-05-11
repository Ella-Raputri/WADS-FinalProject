import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { config } from "dotenv";

config();

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash", 
    apiKey: process.env.GEMINI_API_KEY,
    maxOutputTokens: 2048
});

const classify = async (query) => {
    const systemPrompt = `
        You're a classifier. Only answer "yes" or "no".
        Is the following user question related to the NMC Indonesia competition FAQ?
        User question: "${query}"
        Answer only "yes" or "no".
    `;
    const result = await model.invoke(systemPrompt);
    return result.content?.toLowerCase().includes("yes");
};

const getFallbackMessage = async (query) => {
    const fallbackPrompt = `
    The user asked: "${query}"
    Politely respond that the question is not related to the NMC competition FAQ 
    and suggest contacting an admin. Use a helpful and friendly tone.
    `;
    const result = await model.invoke(fallbackPrompt);
    return result.content;
};
  

export const queryRAG = async (query) => {
    const isRelated = await classify(query);
    if(!isRelated){
        const fallback = await getFallbackMessage(query);
        return {
            result: fallback,
            sources: [],
        };
    }

    try {
        const embedding = new OpenAIEmbeddings({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const pinecone = new PineconeClient({
            apiKey: process.env.PINECONE_API_KEY,
        });

        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
        const vectorStore = await PineconeStore.fromExistingIndex(embedding, {
            pineconeIndex,
        });

        const retriever = vectorStore.asRetriever({
            k: 10,
        });

        const prompt = ChatPromptTemplate.fromMessages([
            [
                "human",
                `You are an assistant for question-answering tasks. 
                Use the following pieces of retrieved context to answer the question. 
                If you don't know the answer, just say that you don't know.
                Question: {question} 
                Context: {context} 
                Answer:`,
            ],
        ]);

        const ragChain = await createStuffDocumentsChain({
            llm: model,
            prompt,
            outputParser: new StringOutputParser(),
        });

        const retrievedDocs = await retriever.invoke(query);
        const response = await ragChain.invoke({
            question: query,
            context: retrievedDocs,
        });
        
        const sources= retrievedDocs.map(doc => {
            const page = doc.metadata?.['loc.pageNumber'];
            return page ? `Page ${page}` : "Unknown Page";
        })

        if (typeof answer === "string" && answer.toLowerCase().includes("i don't know")) {
            return {
                result: "Maaf, saya tidak menemukan jawabannya di dokumen. Silakan hubungi admin untuk pertanyaan ini.",
                sources: [],
            };
        } 
        else {
            return {
                result: `${response}`,
                sources: sources,
            };
        }

    } catch (error) {
        console.error(error);
        return Response.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

