import React from 'react';
import { Card } from './Card';

export interface WalletCardProps {
  balance: number;
  currency: string;
  status: 'active' | 'frozen';
  onDeposit?: () => void;
  onWithdraw?: () => void;
}

export function WalletCard({ balance, currency, status, onDeposit, onWithdraw }: WalletCardProps) {
  const isFrozen = status === 'frozen';
  return (
    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Balance</h2>
        <span className={`text-xs px-2 py-1 rounded-full ${isFrozen ? 'bg-red-500/20 text-red-100' : 'bg-green-500/20 text-green-100'}`}>
          {status}
        </span>
      </div>

      <div className="text-4xl font-bold mb-8">
        {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-lg font-normal opacity-80">{currency}</span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onDeposit}
          disabled={isFrozen}
          className="flex-1 bg-white/20 hover:bg-white/30 disabled:opacity-50 transition-colors py-2 rounded-lg font-medium"
        >
          Deposit
        </button>
        <button
          onClick={onWithdraw}
          disabled={isFrozen}
          className="flex-1 bg-black/20 hover:bg-black/30 disabled:opacity-50 transition-colors py-2 rounded-lg font-medium"
        >
          Withdraw
        </button>
      </div>
    </Card>
  );
}
