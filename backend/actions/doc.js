import { GoogleGenAI } from "@google/genai";
import {index} from "../lib/pc.js";
import { Chunks } from "../db/model.js";
import { storage } from "../appwrite/appwrite.js";
import {ID} from "appwrite"
import {PDFParse} from "pdf-parse";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export const embedText = async (text) => {

    try{
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text,
            config: {
                outputDimensionality: 768,
                taskType: 'SEMANTIC_SIMILARITY'
            }
        });
        
        return response.embeddings;
    }
    catch(error){
        console.error("Error generating embeddings:", error);
        throw error;
    }
}

export const insertChunks = async (workspaceId, documentId, chunks) => {
    try{
        const doc = chunks.map((chunk, index) => ({
                chunkId: `${workspaceId}-${documentId}-chunk-${index}`,
                documentId,
                workspaceId,
                text: chunk
            }))
        const res = await Chunks.insertMany(doc);

        return res.map((item) =>({
            chunkId: item.chunkId,
            text: item.text,
            documentId: item.documentId,
            workspaceId: item.workspaceId
        }));
    }
    catch(error){
        console.error("Error inserting chunks:", error);
        throw error;
    }
}

export const mapchunksToEmbeddings = async (chunks) => {
    try{
        const embeddings = await embedText(chunks.map(chunk => chunk.text));
        const document = chunks.map((chunk, index) => ({
            id: chunk.chunkId,
            documentId: chunk.documentId,
            workspaceId: chunk.workspaceId,
            embedding: embeddings[index].values
        }));
        return document;    
    }
    catch(error){
        console.error("Error mapping chunks to embeddings:", error);
        throw error;
    }
}

export const upsertDocument = async (document, namespaceId) =>{
    try{
        const namespace = index.namespace(namespaceId);
        const vectors = document.map((chunk) => ({
            id: chunk.id,
            values: chunk.embedding,
            metadata: { documentId: chunk.documentId, workspaceId: chunk.workspaceId }
        }));

        const batchSize = 200;
        for (let i = 0; i < vectors.length; i += batchSize) {
            const batch = vectors.slice(i, i + batchSize);
            await namespace.upsert(batch);
        }
    }
    catch(error){
        console.error("Error upserting document:", error);
        throw error;
    }
}

export const embedQuery = async (query) => {
    try{
        console.log("Embedding query:", query);
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: [query],
            config: {
                outputDimensionality: 768,
                taskType: 'SEMANTIC_SIMILARITY'
            }
        });

        return response.embeddings[0].values;
    }
    catch(error){
        console.error("Error generating query embedding:", error);
        throw error;
    }   
};


export const retrieveChunks = async (query, namespaceId, topk = 5) => {
    try{
        const namespace = index.namespace(namespaceId);
        const queryEmbedding = await embedQuery(query);
        const response = await namespace.query({
            vector: queryEmbedding,
            topK: topk,
            includeMetadata: true
        });
        return response.matches.map(match => ({
            score: match.score,
            id: match.id,
        }));
    }
    catch(error){
        console.error("Error retrieving chunks:", error);
        throw error;
    }
}
    
export const buildPrompt = async (query, retrievedChunks) => {
    try{
        const chunkIds = retrievedChunks.map(chunk => chunk.id)
        const chunkDocs = await Chunks.find({ chunkId: { $in: chunkIds } });

        const chunkDocsMap = Object.fromEntries(chunkDocs.map(doc => [doc.chunkId, doc]));
        const sortedChunks = chunkIds.map(id => chunkDocsMap[id]).filter(Boolean);

        const chunkTexts = sortedChunks.map(doc => doc.text).join('\n\n');
        return `You are a helpful AI assistant.
            Answer the user's question using ONLY the information from the provided document excerpts.
            If the answer is not contained in the documents, say "I don't have enough information to answer that."\n\nDocument: ${chunkTexts}\n\nQuery: ${query}\n\nAnswer:`;
    }
    catch(error){
        console.error("Error building prompt:", error);
        throw error;
    }
}


export const generateAnswer = async (prompt) => {
    try{
        const response = await ai.models.generateContent({
            model:'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    }
    catch(error){
        console.error("Error generating answer:", error);
        throw error;
    }   
};

export const extractFile = async (file) =>{
    try{
        
        const uint8Array  = new Uint8Array(file.buffer)
        
        const parser = new PDFParse(uint8Array);
        const result = await parser.getText()
        const fullText = result.pages
            .map(page => page.text)
            .join('\n\n');
        return  fullText;
    }
    catch(error){
        console.error("Error extracting file:", error);
        throw error;
    }
}