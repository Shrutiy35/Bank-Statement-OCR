
import React, { useState, useCallback } from 'react';
import { Transaction } from './types';
import { extractTransactionsFromStatement } from './services/geminiService';
import { parseCSV, downloadCSV } from './utils/csvUtils';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import TransactionTable from './components/TransactionTable';
import TransactionSummary from './components/TransactionSummary';
import Loader from './components/Loader';
import { DownloadIcon } from './components/icons/DownloadIcon';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rawCsv, setRawCsv] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setTransactions([]);
    setRawCsv('');
    setError('');
  };

  const processStatement = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setTransactions([]);
    setRawCsv('');

    try {
      const csvData = await extractTransactionsFromStatement(selectedFile);
      if (!csvData) {
          throw new Error("Received empty data from API.");
      }
      setRawCsv(csvData);
      const parsedTransactions = parseCSV(csvData);
      setTransactions(parsedTransactions);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  const handleDownload = () => {
    if (rawCsv) {
      downloadCSV(rawCsv, `transactions-${selectedFile?.name.split('.')[0] || 'export'}.csv`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Upload Your Bank Statement</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Upload an image or PDF of your statement to automatically extract transactions.
            </p>
          </div>
          
          <FileUpload onFileChange={handleFileChange} />
          
          <div className="flex justify-center">
            <button
              onClick={processStatement}
              disabled={!selectedFile || isLoading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? 'Processing...' : 'Extract Transactions'}
            </button>
          </div>
          
          {isLoading && <Loader />}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {transactions.length > 0 && (
            <div className="space-y-8">
              <TransactionSummary transactions={transactions} />
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Transaction Details</h3>
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all duration-300"
                  >
                    <DownloadIcon />
                    Download CSV
                  </button>
                </div>
                <TransactionTable transactions={transactions} />
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 dark:text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Bank Statement Analyzer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
