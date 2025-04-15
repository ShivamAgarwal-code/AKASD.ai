"use client"
import React, { useState } from 'react';
import axios from 'axios';
export function UploadToAkave() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]); // To store the list of files in the bucket
  const [loading, setLoading] = useState(false); // To show a loading spinner while fetching files

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const bucketName = "myBucket"; // Replace with your bucket name
      const response = await axios.post(
        "http://35.154.167.42:8000/buckets/myBucket/files",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const { fileName } = response.data;
      setDownloadLink(
        "http://35.154.167.42:8000/buckets/myBucket/files/${fileName}/download"
      );
    } catch (error) {
      console.error(error);
      alert("File upload failed!");
    }
  };

  const handleViewFiles = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get("http://35.154.167.42:8000/buckets/myBucket/files");
      console.log(response.data); // Log the response to inspect the structure
      const fileNames = response.data.files || []; // Adjust according to the actual response structure
      setFiles(fileNames);
    } catch (error) {
      console.error(error);
      alert("Failed to retrieve files!");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '50px' }}>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '20px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {file ? <p>{file.name}</p> : <p>Drag & drop your file here</p>}
      </div>
      <button onClick={handleUpload} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Upload
      </button>

      {downloadLink && (
        <div style={{ marginTop: '20px' }}>
          <p>Download Link:</p>
          <a href={downloadLink} target="_blank" rel="noopener noreferrer">
            {downloadLink}
          </a>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <button onClick={handleViewFiles} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? "Loading..." : "View Files in myBucket"}
        </button>

        {files.length > 0 ? (
          <div style={{ marginTop: '20px' }}>
            <p>Files in myBucket:</p>
            <ul>
              {files.map((fileName, index) => (
                <li key={index}>
                  <a href={"http://35.154.167.42:8000/buckets/myBucket/files/${fileName}/download"} target="_blank" rel="noopener noreferrer">
                    {fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No files found in myBucket</p>
        )}
      </div>
    </div>
  );
};

export default UploadToAkave;