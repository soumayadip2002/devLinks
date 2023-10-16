import { Client, Account, Databases } from "appwrite";

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const USERS_ID = import.meta.env.VITE_USERS_ID;
export const LINKS_ID = import.meta.env.VITE_LINKS_ID;

const client = new Client().setEndpoint(API_ENDPOINT).setProject(PROJECT_ID);

export const account = new Account(client);

export const databases = new Databases(client);

export default client;
