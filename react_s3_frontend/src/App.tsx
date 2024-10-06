import React, { useState } from 'react';
import Dropzone from './components/Dropzone';
import FileList from './components/FileList';

interface UploadedFile {
  filename: string;
  url: string;
}

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleDrop = (acceptedFiles: File[]) => {
    setUploading(true);
    setError('');

    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('files', file);
    });

    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          setUploadedFiles(data.files);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Error uploading files');
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Error uploading files');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <div className='container mx-auto p-4 max-w-2xl'>
      <h1 className='text-2xl font-bold mb-4'>Upload Files to Amazon S3</h1>
      <Dropzone onDrop={handleDrop} />
      {uploading && <p className='mt-4 text-blue-600'>Uploading files...</p>}
      {error && <p className='mt-4 text-red-600'>{error}</p>}
      {uploadedFiles.length > 0 && <FileList files={uploadedFiles} />}
    </div>
  );
};

export default App;
