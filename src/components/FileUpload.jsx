import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [viewUrl, setViewUrl] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://securesharebackend.azurewebsites.net/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadStatus("File uploaded successfully!");
      setViewUrl(response.data.viewUrl);
      setMetadata(response.data.metadata);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file.");
    }
  };

  const formatToIST = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString("en-GB", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Upload a File</h1>

        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
        >
          Upload
        </button>

        {uploadStatus && (
          <p className="mt-4 text-lg font-medium text-green-600">
            {uploadStatus}
          </p>
        )}

        {viewUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">View File:</h2>
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-words"
              style={{ wordBreak: "break-all" }}
            >
              {viewUrl}
            </a>

            {metadata && (
              <div className="mt-4">
                <h3 className="text-md font-semibold">Metadata:</h3>
                <p className="text-sm text-gray-600">
                  Expiry Time: {formatToIST(metadata.expirytime)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
