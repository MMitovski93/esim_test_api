//initialize config before all middlewares
import { configInit } from "./pkg/core/config/config";
configInit();
import express from "express";
import cors from "cors";
import { onRequest } from "firebase-functions/v2/https";
// import  formidableServerless from 'formidable-serverless'

// api routes
import campaignRoutes from "./services/campaigns/app";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use(campaignRoutes);

// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

export const api = onRequest(app);
