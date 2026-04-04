import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

export const index = await pc.Index(process.env.PINECONE_INDEX_NAME || 'default-index');