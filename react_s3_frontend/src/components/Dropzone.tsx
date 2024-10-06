import React from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded p-10 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-400 bg-gray-50 hover:border-blue-600'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className='text-gray-700'>Drop the files here ...</p>
      ) : (
        <p className='text-gray-700'>
          Drag & drop some files here, or click to select files
        </p>
      )}
    </div>
  );
};

export default Dropzone;
