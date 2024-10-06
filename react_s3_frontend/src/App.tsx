import React, { useState } from 'react';
import Dropzone from './components/Dropzone';
import FileList from './components/FileList';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UploadedFile {
  filename: string;
  url: string;
}

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true);
    setError('');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('title', title);
    formData.append('summary', summary);

    fetch('http://127.0.0.1:5000/upload_pod', {
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
      <h1 className='text-2xl font-bold mb-4'>Upload Podcast to Amazon S3</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='title'
          >
            Title
          </label>
          <Input
            id='title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter podcast title'
            className='w-full'
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='summary'
          >
            Summary
          </label>
          <Textarea
            id='summary'
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder='Enter podcast summary'
            className='w-full'
          />
        </div>
        <Dropzone onDrop={handleDrop} />
        {uploading && <p className='mt-4 text-blue-600'>Uploading files...</p>}
        {error && <p className='mt-4 text-red-600'>{error}</p>}
        {uploadedFiles.length > 0 && <FileList files={uploadedFiles} />}
        <Button type='submit' className='mt-4'>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default App;
