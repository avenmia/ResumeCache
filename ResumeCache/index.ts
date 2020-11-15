import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient, StorageSharedKeyCredential, BlobDownloadResponseParsed } from "@azure/storage-blob";
import * as fs from "fs";

import * as dotenv from "dotenv";
dotenv.config();

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
   
    const account = process.env.ACCOUNT_NAME || "";
    const accountKey = process.env.ACCOUNT_KEY || "";
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

    const blobServiceClient = new BlobServiceClient(
        // When using AnonymousCredential, following url should include a valid SAS or support public access
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential
      );

    const containerClient = blobServiceClient.getContainerClient("mikesresume");
    const blockBlobClient = containerClient.getBlockBlobClient("resumeData.json");
    const resumePDFClient = containerClient.getBlockBlobClient("resume.pdf");
    const pdfResult = await resumePDFClient.downloadToFile("./cache/resume.pdf");
    const dataResult = await blockBlobClient.downloadToFile("./cache/resumeData.json");
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify("Hello")
    };

};

export default httpTrigger;