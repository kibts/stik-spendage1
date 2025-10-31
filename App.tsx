import React, { useState, useCallback } from 'react';
import { ReportAnalysis } from './types';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { processFile } from './services/fileProcessor';

const Logo = () => (
    <div className="flex items-center space-x-2">
        <svg className="h-8 w-auto text-sky-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
        <span className="text-2xl font-bold text-white">STIK SPENDAGE</span>
    </div>
);

const Header: React.FC = () => (
    <header className="flex-shrink-0 bg-slate-900/70 backdrop-blur-lg border-b border-slate-100/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
             <Logo />
             <h1 className="text-xl font-semibold text-white ml-6">Анализ расходов</h1>
        </div>
    </header>
);

const App: React.FC = () => {
    const [reportData, setReportData] = useState<ReportAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string>('');

    const handleFileProcess = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        setReportData(null);

        try {
            setLoadingMessage('Анализ данных из таблицы...');
            const { analysis } = await processFile(file);
            setReportData(analysis);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, []);

    const handleReset = () => {
        setReportData(null);
        setError(null);
    };

    return (
        <div className="flex flex-col h-screen bg-[#111827] text-gray-300 font-sans" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, rgba(56, 189, 248, 0.1), transparent 30%), radial-gradient(circle at 0% 100%, rgba(34, 211, 238, 0.1), transparent 30%)" }}>
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-lg text-gray-300">{loadingMessage}</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative text-center max-w-xl mx-auto">
                        <strong className="font-bold">Ошибка:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                        <button onClick={handleReset} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                            Попробовать снова
                        </button>
                    </div>
                ) : reportData ? (
                    <Dashboard reportData={reportData} onReset={handleReset} />
                ) : (
                    <div>
                         <p className="text-center mb-6 text-gray-400 text-lg">
                            Загрузите ваш XLSX отчет о расходах для мгновенного анализа.
                        </p>
                        <FileUpload onFileUpload={handleFileProcess} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;