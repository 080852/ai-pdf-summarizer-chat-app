import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pdfUrl = searchParams.get("pdfUrl");
    if (!pdfUrl) {
      throw new Error("PDF URL is missing.");
    }

    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch PDF file.");
    }
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    let pdfTextContent = docs.map(doc => doc.pageContent).join(" ");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const output = await splitter.createDocuments([pdfTextContent]);
    const splitterList = output.map(doc => doc.pageContent);

    return NextResponse.json({ result: splitterList });
  } catch (error) {
    console.error("Error in PDF loader:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
