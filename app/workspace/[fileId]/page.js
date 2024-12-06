'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import PdfViewer from '../_components/PdfViewer';
import TextEditor from '../_components/TextEditor';
import WorkspaceHeader from '../_components/WorkspaceHeader';

function Workspace() {
  const { fileId } = useParams();

  const fileInfo = useQuery(api.fileStorage.GetFileRecord, { fileId });

  useEffect(() => {
    if (fileInfo) {
      console.log('File Information:', fileInfo);
    }
  }, [fileInfo]);

  return (
    <div>
      <WorkspaceHeader />
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="flex-1 p-4 bg-gray-100 rounded-md shadow-md">
          <h2 className="text-lg font-semibold">Text Editor</h2>
          <TextEditor/>
        </div>
        <div className="flex-1 p-4 bg-gray-100 rounded-md shadow-md">
          <h2 className="text-lg font-semibold">PDF Viewer</h2>
          {fileInfo?.fileUrl ? (
            <PdfViewer fileUrl={fileInfo.fileUrl} />
          ) : (
            <p className="text-gray-500">No PDF file available to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Workspace;
