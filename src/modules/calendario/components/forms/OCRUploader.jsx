import React, { useState } from 'react';
import Button from '../common/Button';

const OCRUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setProcessing(true);
    // Simular procesamiento OCR
    setTimeout(() => {
      setProcessing(false);
      if (onUpload) onUpload(file);
    }, 2000);
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-6 text-center">
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="ocr-upload"
        accept="image/*,.pdf"
      />
      <label htmlFor="ocr-upload" className="cursor-pointer">
        <div className="text-4xl mb-2">📄</div>
        <p className="text-sm text-gray-600">Arrastra o haz clic para subir</p>
        <p className="text-xs text-gray-400 mt-1">Imágenes o PDF</p>
      </label>
      {file && (
        <div className="mt-4">
          <p className="text-sm mb-2">Archivo: {file.name}</p>
          <Button onClick={handleUpload} disabled={processing}>
            {processing ? 'Procesando...' : 'Procesar OCR'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OCRUploader;