import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const reqUrl = req.url;  // Fix the typo: reqUrL -> reqUrl
        const { searchParams } = new URL(reqUrl);
        const pdfUrl = searchParams.get('pdfUrl');
        console.log("PDF URL:", pdfUrl);

        // 1. Load the PDF file
        const response = await fetch(pdfUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch PDF file.");
        }
        const data = await response.blob();
        const loader = new WebPDFLoader(data);
        const docs = await loader.load();

        // 2. Split the text into smaller chunks
        let pdfTextContent = '';
        docs.forEach(doc => {
            pdfTextContent += doc.pageContent;
        });

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const output = await splitter.createDocuments([pdfTextContent]);
        let splitterList = [];

        output.forEach(doc => {
            splitterList.push(doc.pageContent); // Push doc.pageContent, not docs.pageContent
        });

        return NextResponse.json({ result: splitterList });

    } catch (error) {
        console.error("Error in PDF loader:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
