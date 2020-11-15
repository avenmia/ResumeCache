import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";

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
    
      let i = 1;
      for await (const container of blobServiceClient.listContainers()) {
        console.log(`Container ${i++}: ${container.name}`);
      }
    
    const responseMessage = "Hello";
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;