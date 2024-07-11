import { Client , Databases } from 'appwrite';


export const PROJECT_ID = "66869da80000d677834f"
export const DATABASE_ID = "668767370019b0f73936"
export const COLLECTION_ID = "66876749002017f77539"

const client = new Client();

client
.setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
.setProject(PROJECT_ID) // Your project ID


export const databases = new Databases(client);


export default client;