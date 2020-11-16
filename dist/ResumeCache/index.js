"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_blob_1 = require("@azure/storage-blob");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = process.env.ACCOUNT_NAME || "";
        const accountKey = process.env.ACCOUNT_KEY || "";
        const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(account, accountKey);
        const blobServiceClient = new storage_blob_1.BlobServiceClient(
        // When using AnonymousCredential, following url should include a valid SAS or support public access
        `https://${account}.blob.core.windows.net`, sharedKeyCredential);
        const RESUME_DATA_PATH = "./ResumeCache/cache/resumeData.json";
        const RESUME_PDF_PATH = "./ResumeCache/cache/resume.pdf";
        const containerClient = blobServiceClient.getContainerClient("mikesresume");
        const blockBlobClient = containerClient.getBlockBlobClient("resumeData.json");
        const resumePDFClient = containerClient.getBlockBlobClient("resume.pdf");
        const pdfResult = yield resumePDFClient.downloadToFile(RESUME_PDF_PATH);
        const dataResult = yield blockBlobClient.downloadToFile(RESUME_DATA_PATH);
        try {
            if (fs.existsSync(RESUME_DATA_PATH)) {
                const resumeData = fs.readFileSync(RESUME_DATA_PATH);
                context.res = {
                    status: 200,
                    body: JSON.stringify(JSON.parse(resumeData.toString()))
                };
                return;
            }
        }
        catch (e) {
            context.res = {
                status: 500,
                body: JSON.stringify(e)
            };
        }
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: JSON.stringify("Hello")
        };
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map