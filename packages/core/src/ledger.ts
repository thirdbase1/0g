export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'reversed';
  reference: string;
  metadata?: any;
  createdAt: Date;
}

export class LedgerService {
  private wallets: Map<string, Wallet> = new Map();
  private transactions: Map<string, Transaction> = new Map();

  // In-memory implementation for demo
  async createWallet(userId: string, currency: string = 'USD'): Promise<Wallet> {
    const id = crypto.randomUUID();
    const wallet: Wallet = {
      id,
      userId,
      balance: 0,
      currency,
      status: 'active'
    };
    this.wallets.set(id, wallet);
    return wallet;
  }

  async getWallet(id: string): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }

  async processTransaction(
    walletId: string,
    type: 'credit' | 'debit',
    amount: number,
    reference: string,
    metadata?: any
  ): Promise<Transaction> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) throw new Error('Wallet not found');
    if (wallet.status !== 'active') throw new Error('Wallet is not active');

    if (type === 'debit' && wallet.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Atomic update simulation
    const tx: Transaction = {
      id: crypto.randomUUID(),
      walletId,
      type,
      amount,
      status: 'success',
      reference,
      metadata,
      createdAt: new Date()
    };

    if (type === 'credit') {
      wallet.balance += amount;
    } else {
      wallet.balance -= amount;
    }

    this.transactions.set(tx.id, tx);
    this.wallets.set(walletId, wallet);

    return tx;
  }
}

export const ledger = new LedgerService();
