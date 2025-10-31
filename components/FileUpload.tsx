import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
    onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileUpload(e.target.files[0]);
        }
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileUpload(e.dataTransfer.files[0]);
        }
    }, [onFileUpload]);

    return (
        <div 
            className={`flex items-center justify-center w-full max-w-3xl mx-auto p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging ? 'border-sky-500 bg-[#1F2937]/50' : 'border-[#374151] hover:border-gray-500 bg-[#1F2937]'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-12 h-12 mb-4 text-gray-500" />
                    <p className="mb-2 text-xl text-gray-400">
                        <span className="font-semibold text-sky-400">Нажмите чтобы загрузить</span> или перетащите файл
                    </p>
                    <p className="text-sm text-gray-500">Файлы XLSX или XLS</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
            </label>
        </div>
    );
};

export default FileUpload;
