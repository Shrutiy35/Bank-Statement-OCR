
import React from 'react';
import { Transaction } from '../types';
import { IncomeIcon } from './icons/IncomeIcon';
import { SpendingIcon } from './icons/SpendingIcon';
import { TransactionsIcon } from './icons/TransactionsIcon';

interface TransactionSummaryProps {
  transactions: Transaction[];
}

const SummaryCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
}> = ({ icon, title, value, color }) => (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);


const TransactionSummary: React.FC<TransactionSummaryProps> = ({ transactions }) => {
  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.Amount > 0) {
        acc.totalIncome += transaction.Amount;
      } else {
        acc.totalSpending += transaction.Amount;
      }
      return acc;
    },
    { totalIncome: 0, totalSpending: 0 }
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
            icon={<IncomeIcon className="text-green-500" />}
            title="Total Income"
            value={formatCurrency(summary.totalIncome)}
            color="bg-green-100 dark:bg-green-900/50"
        />
        <SummaryCard 
            icon={<SpendingIcon className="text-red-500" />}
            title="Total Spending"
            value={formatCurrency(summary.totalSpending)}
            color="bg-red-100 dark:bg-red-900/50"
        />
        <SummaryCard 
            icon={<TransactionsIcon className="text-blue-500" />}
            title="Total Transactions"
            value={transactions.length}
            color="bg-blue-100 dark:bg-blue-900/50"
        />
    </div>
  );
};

export default TransactionSummary;
