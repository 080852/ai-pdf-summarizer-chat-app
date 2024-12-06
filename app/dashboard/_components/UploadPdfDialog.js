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
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(" ");
  const [open,setOpen]=useState(false);

  const OnFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const OnUpload = async () => {
    setLoading(true);
    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });

      const { storageId } = await result.json(); // Get storageId from the response

      if (!storageId) {
        throw new Error("No storageId received from the server.");
      }

      console.log("StorageId:", storageId);

      // Step 3: Get the fileUrl using the storageId
      const fileUrlResponse = await getFileUrl({ storageId });

      if (!fileUrlResponse?.fileUrl) {
        throw new Error("File URL not found.");
      }

      const fileUrl = fileUrlResponse.fileUrl; // Ensure fileUrl is returned correctly
      console.log("FileUrl:", fileUrl);

      // Step 4: Save the file entry with storageId, fileUrl, and fileName to the database
      const fileId = uuid4();
      await addFileEntry({
        fileId: fileId,
        storageId: storageId,
        fileUrl: fileUrl,
        fileName: fileName ?? "Untitled File",
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      // API CALL to fetch pdf process data
      const ApiResp = await axios.get(`/api/pdf-loader?pdfUrl=${fileUrl}`);
      console.log(ApiResp.data.result);

      
      await embeddDocument({
       splitText: ApiResp.data.result,
         fileId: fileId
       });
      // console.log(embdeddResult);

    } catch (error) {
      console.error("Upload failed:", error.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>+ Upload PDF File</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Pdf File</DialogTitle>
          <DialogDescription asChild>
            <div>
              <h2 className="mt-5">Please Select a file to upload</h2>
              <div className="flex mt-5 gap-2 p-3 rounded-md border">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => OnFileSelect(event)}
                />
              </div>
              <div className="mt-2">
                <label>File Name *</label>
                <Input
                  placeholder="File Name"
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPdfDialog;
