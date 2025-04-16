import fs from "fs";
import csvParser from "csv-parser";
import { getBucket } from "../core/db";
import { randomId } from "../core/strings";

interface iFile {
  name: string;
  path: string;
  type: string;
  size?: string;
}
export const parseCsv = (filePath: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const results: string[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data: { icc_id: string }) => {
        if (data.icc_id) results.push(data.icc_id);
      })
      .on("end", () => {
       resolve(results);
      })
      .on("error", (err: any) => {
        console.error("Error parsing CSV:", err);
        reject(err);
      });
  });
};

export const uploadToStorage = async (file: iFile) => {
  const bucket = getBucket();
  const storageFile = bucket.file(`uploads/${file.name}_${randomId(50)}`);

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(file.path);

    // Create a writable stream to Firebase Storage
    const writeStream = storageFile.createWriteStream({
      metadata: {
        contentType: file.type,
      },
    });

    // Pipe the file stream to Firebase Storage
    fileStream.pipe(writeStream);

    writeStream.on("finish", () => {
      resolve(storageFile.publicUrl());
    });

    writeStream.on("error", (err) => {
      console.error("Error uploading file:", err);
      reject(err);
    });
  });
};
