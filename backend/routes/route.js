import Router from "express";
import {chunkText} from "../utils/util.js";
import multer from "multer";
import {upsertDocument, mapchunksToEmbeddings, retrieveChunks, buildPrompt, generateAnswer, insertChunks, extractFile} from "../actions/doc.js";

export const router = Router();
const upload = multer()

router.post("/upload", upload.single("file"), async(req, res) => {
    try {
        const {docId, workspaceId } = req.body;
        const file = req.file;

        const doc = await extractFile(file);
        const chunks = chunkText(doc);
        const chunkDocs = await insertChunks(workspaceId, docId, chunks);
        const document = await mapchunksToEmbeddings(chunkDocs);
        await upsertDocument(document, workspaceId);
        res.status(200).json({ message: "Document processed and upserted successfully." });
    }
    catch (error) {
        console.error("Error in /upload route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

})

router.post("/query", async(req, res) => {
    try{
        const { prompt, workspaceId } = req.body;
        console.log("Received query:", prompt, "for workspaceId:", workspaceId);
        const retrievedChunks = await retrieveChunks(prompt, workspaceId);
        const generatedPrompt = await buildPrompt(prompt, retrievedChunks);
        const answer = await generateAnswer(generatedPrompt);
        res.status(200).json({ answer });
    }
    catch(error){
        console.error("Error in /query route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})