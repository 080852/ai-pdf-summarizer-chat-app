"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useAction, useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import uuid4 from "uuid4";

function UploadPdfDialog({ children }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddDocument = useAction(api.myAction.ingest);
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);

  const OnFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size exceeds the 10MB limit.");
      return;
    }
    if (selectedFile.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    setFile(selectedFile);
  };

  const OnUpload = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }
    if (!fileName.trim()) {
      alert("Please provide a name for the file.");
      return;
    }

    setLoading(true);
    try {
      const postUrl = await generateUploadUrl();

      const uploadResult = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResult.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await uploadResult.json();

      const fileUrlResponse = await getFileUrl({ storageId });
      if (!fileUrlResponse?.fileUrl) {
        throw new Error("Failed to fetch the file URL.");
      }

      const fileId = uuid4();
      await addFileEntry({
        fileId,
        storageId,
        fileUrl: fileUrlResponse.fileUrl,
        fileName: fileName || "Untitled File",
        createdBy: user?.primaryEmailAddress?.emailAddress || "Anonymous",
      });

      const apiResponse = await axios.get(`/api/pdf-loader?pdfUrl=${encodeURIComponent(fileUrlResponse.fileUrl)}`);
      
      if (!apiResponse.data?.result) {
        throw new Error("PDF processing failed");
      }

      await embeddDocument({
        splitText: apiResponse.data.result,
        fileId,
      });

      alert("File successfully uploaded and processed!");
    } catch (error) {
      console.error("Error during upload:", error);
      alert(`An error occurred: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="bg-blue-500 text-white hover:bg-blue-600">
          + Upload PDF File
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white shadow-lg rounded-md p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Upload PDF File</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div>
            <h2 className="text-sm font-medium text-gray-600 mt-2">Please select a file to upload</h2>
            <div className="flex mt-3 gap-2 p-3 rounded-md border border-gray-300 bg-gray-50">
              <input type="file" accept="application/pdf" onChange={OnFileSelect} className="text-gray-600" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">File Name *</label>
              <Input
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" className="bg-gray-300 text-black hover:bg-gray-400">Close</Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading} className="bg-green-500 text-white hover:bg-green-600">
            {loading ? <Loader2Icon className="animate-spin text-white" /> : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPdfDialog;