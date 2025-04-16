import admin from "firebase-admin";
import { getConfig } from "../config/config";

const cfg = getConfig("firebase");

admin.initializeApp({
  credential: admin.credential.cert(cfg.db),
  storageBucket: cfg.storage.bucket_url,
});

//db reference
const db = admin.firestore();
const bucket = admin.storage().bucket();

export const getDB = () => db;
export const getBucket = () => bucket;
