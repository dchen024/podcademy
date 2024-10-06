import React from 'react';

interface UploadedFile {
  filename: string;
  url: string;
}

interface FileListProps {
  files: UploadedFile[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
  return (
    <div className='mt-6'>
      <h2 className='text-xl font-semibold mb-2'>Uploaded Files:</h2>
      <ul className='list-disc list-inside'>
        {files.map((file, index) => (
          <li key={index}>
            <strong>{file.filename}</strong> -{' '}
            <a
              href={file.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline'
            >
              View File
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
