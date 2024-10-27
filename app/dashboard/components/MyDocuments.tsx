import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaDownload } from 'react-icons/fa';

interface Document {
  id: string;
  title: string;
  createdAt: string;
}

const MyDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleDownload = (documentId: string): void => {
    console.log(`Downloading document with ID: ${documentId}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">My Documents</h2>
      {documents.length === 0 ? (
        <p className="text-gray-500">No documents found.</p>
      ) : (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                <FaFileAlt className="text-blue-500 mr-3" />
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(doc.id)}
                className="flex items-center text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                <FaDownload className="mr-1" />
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyDocuments;