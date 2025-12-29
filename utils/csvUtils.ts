
import { Transaction } from '../types';

export const parseCSV = (csvText: string): Transaction[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const transactions: Transaction[] = [];

  const dateIndex = headers.indexOf('Date');
  const descriptionIndex = headers.indexOf('Description');
  const amountIndex = headers.indexOf('Amount');
  const categoryIndex = headers.indexOf('Category');
  const notesIndex = headers.indexOf('Notes');
  
  if ([dateIndex, descriptionIndex, amountIndex, categoryIndex].some(i => i === -1)) {
    throw new Error("CSV is missing required headers (Date, Description, Amount, Category).");
  }

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');

    // Basic check for malformed rows
    if (values.length < headers.length) continue;
    
    const amount = parseFloat(values[amountIndex]);

    if (isNaN(amount)) continue; // Skip rows with invalid amount

    const transaction: Transaction = {
      Date: values[dateIndex]?.trim() || '',
      Description: values[descriptionIndex]?.trim() || '',
      Amount: amount,
      Category: values[categoryIndex]?.trim() || 'Other',
      Notes: values[notesIndex]?.trim() || '',
    };
    transactions.push(transaction);
  }
  return transactions;
};

export const downloadCSV = (csvText: string, filename: string): void => {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.href) {
    URL.revokeObjectURL(link.href);
  }
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
