
import React from 'react';
import { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        No transactions to display.
      </div>
    );
  }

  const formatAmount = (amount: number) => {
    const isNegative = amount < 0;
    const colorClass = isNegative ? 'text-red-500' : 'text-green-500';
    return (
      <span className={colorClass}>
        {isNegative ? '-' : '+'}
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount)).substring(1)}
      </span>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
        'Food': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        'Shopping': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        'Travel': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'Utilities': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'Rent': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        'Salary': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'Transfer': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
        'ATM': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
        'EMI': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        'Fees': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        'Investment': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
        'Other': 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
          <tr>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Description</th>
            <th scope="col" className="px-6 py-3 text-right">Amount</th>
            <th scope="col" className="px-6 py-3">Category</th>
            <th scope="col" className="px-6 py-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, index) => (
            <tr key={index} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
              <td className="px-6 py-4 whitespace-nowrap">{t.Date}</td>
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{t.Description}</td>
              <td className="px-6 py-4 text-right font-mono font-semibold">{formatAmount(t.Amount)}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(t.Category)}`}>
                  {t.Category}
                </span>
              </td>
              <td className="px-6 py-4">{t.Notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
