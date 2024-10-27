import React, { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiFileText, FiFile } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentEditor from './DocEditor';
import LoadingSpinner from '@/UI/LoadingSpinner';

interface TemplateType {
  id: number;
  title: string;
  icon: string | null;
  file?: string;
}

interface GeneratedDocumentType {
  id: number;
  name: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TemplateType[];
}

const GenerateDocument: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocumentType | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [templateContent, setTemplateContent] = useState<string>('');
  const [fileContent, setFileContent] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('https://api.legalbooks.in/api/v1/templates');
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data: ApiResponse = await response.json();
      setTemplates(data.results);
      setLoading(false);
    } catch (error) {
      setError('Failed to load templates. Please try again later.');
      setLoading(false);
    }
  };

  const fetchTemplateContent = async (templateId: number) => {
    try {
      const response = await fetch(`https://api.legalbooks.in/api/v1/templates/${templateId}`, {
        credentials: 'include',
      });
      
      console.log('Template response status:', response.status);
      console.log('Template response headers:', Object.fromEntries(response.headers.entries()));
  
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
      }
  
      const data: TemplateType = await response.json();
      
      if (data.file) {
      const contentResponse = await fetch(data.file);

      console.log('File response status:', contentResponse.status);
      console.log('File response headers:', Object.fromEntries(contentResponse.headers.entries()));

      if (!contentResponse.ok) {
        throw new Error(`Failed to fetch file content: ${contentResponse.status} ${contentResponse.statusText}`);
      }

      const arrayBuffer = await contentResponse.arrayBuffer();
      console.log('Fetched ArrayBuffer size:', arrayBuffer.byteLength);
      setFileContent(arrayBuffer);  // Store the ArrayBuffer in state
    }
  } catch (error) {
    console.error('Error in fetchTemplateContent:', error);
    setError('Failed to load template content. Please try again.');
  }
};

  const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSelection = async (template: TemplateType) => {
    setSelectedTemplate(template);
    await fetchTemplateContent(template.id);
  };

  const generateDocument = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedDocument({ id: Date.now(), name: `Generated_${selectedTemplate.title}.pdf` });
    setIsGenerating(false);
    setShowEditor(true);
  };

  const downloadDocument = () => {
    if (generatedDocument) {
      console.log('Downloading document:', generatedDocument.name);
    }
  };

  if (showEditor) {
    return <DocumentEditor fileContent={fileContent} initialContent={''} fileUrl={''} templateId={''} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Generate Custom Documents
        </h1>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Select a Template</h2>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-500 text-white p-3 rounded-r-md hover:bg-green-600 transition-colors">
              <FiSearch />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-white p-4 rounded-md shadow cursor-pointer aspect-square flex flex-col justify-between items-center ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => handleTemplateSelection(template)}
              >
                <div className="flex-grow flex items-center justify-center">
                  <FiFile className="text-4xl text-green-500" />
                </div>
                <h3 className="font-semibold text-center text-sm mt-2 line-clamp-2">
                  {toTitleCase(template.title)}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-8 p-4 bg-green-50 rounded-lg"
          >
            <div className="flex items-center mb-2">
              <FiFile className="text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-green-800">
                Selected Template: {toTitleCase(selectedTemplate.title)}
              </h3>
            </div>
            <button
              onClick={generateDocument}
              disabled={isGenerating}
              className={`${
                isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
              } text-white px-4 py-2 rounded-md transition-colors flex items-center mt-2`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <FiFileText className="mr-2" />
                  Generate Document
                </>
              )}
            </button>
          </motion.div>
        )}

        {generatedDocument && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-50 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Generated Document</h3>
            <p className="mb-4 text-blue-600">{generatedDocument.name}</p>
            <button
              onClick={downloadDocument}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
            >
              <FiDownload className="mr-2" />
              Download Document
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default GenerateDocument;