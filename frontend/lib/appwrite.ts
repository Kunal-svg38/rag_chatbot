import {Client, Storage} from 'appwrite'
import 'dotenv/config'

const client = new Client().setEndpoint(process.env.APPWRITE_API_ENDPOINT!).setProject(process.env.APPWRITE_PROJECT_ID!)

const storage = new Storage(client)

export {client, storage}