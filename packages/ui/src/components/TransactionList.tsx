import React from 'react';
import { Table, type Column } from './Table';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  status: 'pending' | 'success' | 'failed';
  date: string;
  reference: string;
}

export interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
}

export function TransactionList({ transactions, title = 'Recent Transactions' }: TransactionListProps) {
  const columns: Column<Transaction>[] = [
    { key: 'reference', header: 'Reference' },
    { key: 'date', header: 'Date', render: (tx) => new Date(tx.date).toLocaleDateString() },
    {
      key: 'type',
      header: 'Type',
      render: (tx) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          tx.type === 'credit' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'
        }`}>
          {tx.type.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tx) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          tx.status === 'success' ? 'text-green-800 bg-green-100' :
          tx.status === 'failed' ? 'text-red-800 bg-red-100' :
          'text-yellow-800 bg-yellow-100'
        }`}>
          {tx.status}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (tx) => (
        <div className={`font-medium ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
          {tx.type === 'credit' ? '+' : '-'} ${tx.amount.toFixed(2)}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <Table data={transactions} columns={columns} />
    </div>
  );
}
