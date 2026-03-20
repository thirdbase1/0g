import React from 'react';
import { WalletCard } from '@pulsestack/ui/src/components/WalletCard';
import { TransactionList } from '@pulsestack/ui/src/components/TransactionList';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [balance, setBalance] = useState(450.00);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: '1', type: 'credit', amount: 500, status: 'success', date: '2023-10-01', reference: 'dep_123' },
    { id: '2', type: 'debit', amount: 50, status: 'success', date: '2023-10-02', reference: 'wd_123' },
    { id: '3', type: 'debit', amount: 100, status: 'failed', date: '2023-10-03', reference: 'wd_124' },
  ]);

  const handleDeposit = async () => {
    setLoading(true);
    try {
      // Find the ID of the dynamically generated demo wallet from the server log, or fallback to 'user_123'.
      // For this demo, we'll try to just hit the endpoint, and if the wallet doesn't exist, we'll create it.
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId: 'user_123', amount: 100 })
      });
      const data = await res.json();
      if (data.success && data.transaction) {
        setBalance(prev => prev + data.transaction.amount);
        setTransactions([
          {
            id: data.transaction.id,
            type: 'credit',
            amount: data.transaction.amount,
            status: 'success',
            date: new Date().toISOString(),
            reference: data.transaction.reference
          },
          ...transactions
        ]);
      } else {
        console.error('Deposit failed:', data.error);
      }
    } catch (err) {
      console.error('Failed to deposit:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">Settings</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <WalletCard
              balance={balance}
              currency="USD"
              status={loading ? "frozen" : "active"}
              onDeposit={handleDeposit}
              onWithdraw={() => alert('Withdraw flow not yet implemented')}
            />
          </div>

          <div className="md:col-span-2">
            <TransactionList transactions={transactions as any} />
          </div>
        </div>
      </div>
    </div>
  );
}
