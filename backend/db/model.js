import mongoose from "mongoose";

const chunksSchema = new mongoose.Schema({
    chunkId: {type: String, required: true},
    documentId: {type: String,required: true},
    workspaceId: {type: String, required: true},
    text: {type: String, required: true},
},{timestamps: true});

export const Chunks = mongoose.model("Chunks", chunksSchema);