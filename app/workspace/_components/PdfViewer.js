
function PdfViewer({ fileUrl }) {
  console.log('File URL:', fileUrl);

  if (!fileUrl) {
    return <p className="text-gray-500">PDF file not found.</p>;
  }

  return (
    <div>
      <iframe
        src={fileUrl}
        height="90vh"
        width="100%"
        className="h-[90vh] border"
        title="PDF Viewer"
      />
    </div>
  );
}

export default PdfViewer;
