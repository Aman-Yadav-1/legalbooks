import React, { useState, useRef, useEffect } from 'react';
import { FiZoomIn, FiZoomOut, FiPrinter, FiEdit, FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify, FiSave } from 'react-icons/fi';
import DOMPurify from 'dompurify';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

interface PageFormat {
  name: string;
  width: number;
  height: number;
  margin: number;
}

interface DocumentEditorProps {
  initialContent: string;
  fileUrl: string;
  fileContent: ArrayBuffer | null;
  templateId: string;
}

const PAGE_FORMATS: { [key: string]: PageFormat } = {
  A4: { name: 'A4', width: 210, height: 297, margin: 25 },
  A3: { name: 'A3', width: 297, height: 420, margin: 25 },
  Legal: { name: 'Legal', width: 216, height: 356, margin: 25 },
  Letter: { name: 'Letter', width: 216, height: 279, margin: 25 },
};

const fonts = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Georgia',
  'Palatino',
  'Garamond',
  'Bookman',
  'Comic Sans MS',
  'Trebuchet MS',
  'Arial Black',
  'Impact',
  'Lucida Sans Unicode',
  'Tahoma',
  'Geneva',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Raleway',
  'Poppins',
  'Playfair Display',
  'Merriweather'
];

const DocumentEditor: React.FC<DocumentEditorProps> = ({ initialContent, fileUrl, fileContent,templateId  }) => {
  const [zoom, setZoom] = useState<number>(100);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [font, setFont] = useState<string>('Arial');
  const [fontSize, setFontSize] = useState<number>(12);
  const [pageFormat, setPageFormat] = useState<PageFormat>(PAGE_FORMATS.A4);
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: true,
    alignCenter: false,
    alignRight: false,
    alignJustify: false,
  });
  const [documentContent, setDocumentContent] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');
  const [documentStatus, setDocumentStatus] = useState<string>('draft');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processDocument = async () => {
      if (fileContent) {
        try {
          console.log('Processing file content, size:', fileContent.byteLength);
          const result = await mammoth.convertToHtml({ arrayBuffer: fileContent });
          console.log('Mammoth conversion result:', result);
          setDocumentContent(result.value);
        } catch (error) {
          console.error('Error processing document:', error);
          setDocumentContent('Error processing document. Please try again.');
        }
      }
    };

    processDocument();
  }, [fileContent]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = documentContent;
      editorRef.current.focus();
    }
  }, [documentContent]);

  useEffect(() => {
    if (editorRef.current) {
      const sanitizedContent = DOMPurify.sanitize(initialContent);
      editorRef.current.innerHTML = sanitizedContent;
      editorRef.current.focus();
    }
  }, [initialContent]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  const applyStyle = (command: string) => {
    document.execCommand(command, false);
    updateActiveStyles();
  };

  const updateActiveStyles = () => {
    setActiveStyles({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      alignLeft: document.queryCommandState('justifyLeft'),
      alignCenter: document.queryCommandState('justifyCenter'),
      alignRight: document.queryCommandState('justifyRight'),
      alignJustify: document.queryCommandState('justifyFull'),
    });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handlePrint = () => {
    window.print();
  };

  const saveAsPDF = async () => {
    if (!editorRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const canvas = await html2canvas(editorRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', [pageFormat.width, pageFormat.height]);
      pdf.addImage(imgData, 'PNG', 0, 0, pageFormat.width, pageFormat.height);
      const pdfBlob = pdf.output('blob');

      // Simulating payment process
      const paymentResult = await simulatePayment();
      if (!paymentResult.success) {
        throw new Error('Payment failed');
      }

      // Verify payment signature
      const signatureVerified = await verifyPaymentSignature(paymentResult.signature);
      if (!signatureVerified) {
        throw new Error('Payment signature verification failed');
      }

      // Call create user doc API
      const formData = new FormData();
      formData.append('name', documentName);
      formData.append('template', templateId);
      formData.append('status', documentStatus);
      formData.append('document', pdfBlob, 'document.pdf');

      const response = await axios.post('https://api.legalbooks.in/api/v1/userdocuments/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Document created:', response.data);
      // Handle successful document creation (e.g., show success message, update UI)
    } catch (err) {
      console.error('Error saving document:', err);
      setError('Failed to save document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const simulatePayment = async () => {
    // Simulating a payment process
    return new Promise<{ success: boolean; signature: string }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true, signature: 'mocked-payment-signature' });
      }, 1000);
    });
  };

  const verifyPaymentSignature = async (signature: string) => {
    // Simulating signature verification
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-area, #printable-area * {
              visibility: visible;
            }
            #printable-area {
              position: absolute;
              left: 0;
              top: 0;
              width: ${pageFormat.width}mm;
              height: ${pageFormat.height}mm;
              padding: 0;
              margin: 0;
              box-sizing: border-box;
            }
            @page {
              size: ${pageFormat.name};
              margin: 0;
            }
          }
        `}
      </style>
      <div className="bg-white shadow-md p-3 flex items-center space-x-2 flex-wrap sticky top-0 z-10">
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className={`p-2 rounded-md hover:bg-gray-200 ${isEditing ? 'bg-gray-200 text-sm' : ''} flex items-center`}
        >
          <FiEdit className="mr-2" /> {isEditing ? 'Editing' : 'Viewing'}
        </button>
        <button onClick={handleZoomOut} className="p-2 rounded-md hover:bg-gray-200">
          <FiZoomOut />
        </button>
        <span>{zoom}%</span>
        <button onClick={handleZoomIn} className="p-2 rounded-md hover:bg-gray-200">
          <FiZoomIn />
        </button>
        <select 
          value={pageFormat.name}
          onChange={(e) => setPageFormat(PAGE_FORMATS[e.target.value])}
          className="bg-transparent border border-gray-300 rounded-md text-sm p-1"
        >
          {Object.keys(PAGE_FORMATS).map(format => (
            <option key={format} value={format}>{format}</option>
          ))}
        </select>
        <button onClick={handlePrint} className="p-2 rounded-md hover:bg-gray-200">
          <FiPrinter />
        </button>
        <select 
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="bg-transparent border border-gray-300 rounded-md text-sm p-1"
        >
          {fonts.map(fontName => (
            <option key={fontName} value={fontName} style={{ fontFamily: fontName }}>
              {fontName}
            </option>
          ))}
        </select>
        <select 
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="bg-transparent border border-gray-300 rounded-md text-sm p-1"
        >
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <button onClick={() => applyStyle('bold')} className={`p-2 rounded-md hover:bg-gray-200 ${activeStyles.bold ? 'bg-gray-200' : ''}`}>
          <FiBold />
        </button>
        <button onClick={() => applyStyle('italic')} className={`p-2 rounded-md hover:bg-gray-200 ${activeStyles.italic ? 'bg-gray-200' : ''}`}>
          <FiItalic />
        </button>
        <button onClick={() => applyStyle('underline')} className={`p-2 rounded-md hover:bg-gray-200 ${activeStyles.underline ? 'bg-gray-200' : ''}`}>
          <FiUnderline />
        </button>
        <button onClick={() => applyStyle('justifyLeft')} className={`p-2 rounded-md hover:bg-gray-200 ${activeStyles.alignLeft ? 'bg-gray-200' : ''}`}>
          <FiAlignLeft />
        </button>
        <button onClick={() => applyStyle('justifyCenter')} className={`p-2 rounded-md hover:bg-gray-200 ${activeStyles.alignCenter ? 'bg-gray-200' : ''}`}>
          <FiAlignCenter />
        </button>
        <button onClick={() => applyStyle('justifyRight')} className={`p-2 rounded-md hover:bg-gray-200 ${activeStyles.alignRight ? 'bg-gray-200' : ''}`}>
          <FiAlignRight />
        </button>
        <button onClick={() => applyStyle('justifyFull')} className={`p-2 rounded-md hover:bg-gray-200 ${activeStyles.alignJustify ? 'bg-gray-200' : ''}`}>
          <FiAlignJustify />
        </button>
        <input
          type="text"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Document Name"
          className="bg-transparent border border-gray-300 rounded-md text-sm p-1"
        />
        <select
          value={documentStatus}
          onChange={(e) => setDocumentStatus(e.target.value)}
          className="bg-transparent border border-gray-300 rounded-md text-sm p-1"
        >
          <option value="draft">Draft</option>
          <option value="review">Review</option>
          <option value="final">Final</option>
        </select>
        <button
          onClick={saveAsPDF}
          disabled={isLoading}
          className="p-2 rounded-md hover:bg-gray-200 flex items-center"
        >
          <FiSave className="mr-2" /> Save as PDF
        </button>
      </div>

      <div className="flex-grow overflow-auto bg-gray-200 p-4">
        <div 
          className="mx-auto bg-white shadow-xl"
          style={{
            width: `${pageFormat.width}mm`,
            minHeight: `${pageFormat.height}mm`,
            padding: `${pageFormat.margin}mm`,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <div 
            id="printable-area"
            ref={editorRef}
            className="w-full h-full focus:outline-none overflow-hidden"
            contentEditable={isEditing}
            onPaste={handlePaste}
            onFocus={updateActiveStyles}
            onKeyUp={updateActiveStyles}
            onMouseUp={updateActiveStyles}
            style={{ 
              fontFamily: font, 
              fontSize: `${fontSize}px`,
              minHeight: `${pageFormat.height - 2 * pageFormat.margin}mm`,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          />
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">Saving document...</div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-md">
          {error}
        </div>
      )}
    </div>
    );
  };
  
  export default DocumentEditor;