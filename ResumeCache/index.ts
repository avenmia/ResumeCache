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
    
    const RESUME_DATA_PATH = "./ResumeCache/cache/resumeData.json";
    const RESUME_PDF_PATH = "./ResumeCache/cache/resume.pdf";
    const containerClient = blobServiceClient.getContainerClient("mikesresume");
    const blockBlobClient = containerClient.getBlockBlobClient("resumeData.json");
    const resumePDFClient = containerClient.getBlockBlobClient("resume.pdf");
    await resumePDFClient.downloadToFile(RESUME_PDF_PATH);
    await blockBlobClient.downloadToFile(RESUME_DATA_PATH);

    try
    {
        if(fs.existsSync(RESUME_DATA_PATH))
        {
            const resumeData = fs.readFileSync(RESUME_DATA_PATH);
            context.res = {
                status: 200,
                body:JSON.stringify(JSON.parse(resumeData.toString()))
            }
            return;

        }
    }
    catch(e)
    {
        context.res = {
            status: 500,
            body: JSON.stringify(e)
        }
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        status: 404,
        body: JSON.stringify("Files not found")
    };

};

export default httpTrigger;