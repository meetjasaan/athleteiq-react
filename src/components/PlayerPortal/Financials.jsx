import React, { useState } from 'react';
import P2PPaymentModal from './P2PPaymentModal';

const Financials = ({ userEmail }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const handlePaymentConfirm = (data) => {
    // Add transaction to history
    const newTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      type: data.paymentMethod,
      amount: data.amount,
      status: 'pending',
      confirmationNumber: data.confirmationNumber,
    };
    setTransactions([newTransaction, ...transactions]);
    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-white border border-borderLight p-6 brutal-clip">
        <h2 className="font-display text-xl font-black text-dark uppercase mb-6">Account Balance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-clinical border border-borderLight p-6 text-center rounded">
            <p className="font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
              Outstanding Balance
            </p>
            <div className="font-display text-4xl font-black text-brand mb-4">
              ${Math.abs(balance).toFixed(2)}
            </div>
            <p className="font-body text-xs text-gray-600">
              {balance < 0 ? 'Amount due' : 'Account credit'}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-brand text-dark font-display font-black text-sm py-3 brutal-clip hover:bg-dark hover:text-brand transition-all"
            >
              💳 Pay via P2P
            </button>
            <p className="font-mono text-[10px] text-gray-400 text-center">
              Venmo, Cash App, or direct transfer
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-borderLight p-6 brutal-clip">
        <h3 className="font-display text-lg font-black text-dark uppercase mb-4">Transaction History</h3>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-mono text-sm text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-clinical border border-borderLight rounded">
                <div>
                  <p className="font-display font-bold text-dark text-sm">
                    {tx.type === 'venmo' ? '💚 Venmo' : '📱 Cash App'}
                  </p>
                  <p className="font-mono text-[10px] text-gray-500 mt-1">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-black text-brand">
                    ${tx.amount.toFixed(2)}
                  </p>
                  <p
                    className="font-mono text-[10px] font-bold"
                    style={{
                      color: tx.status === 'completed' ? '#10B981' : '#F59E0B',
                    }}
                  >
                    {tx.status.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <P2PPaymentModal
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentConfirm}
          outstandingBalance={Math.abs(balance)}
        />
      )}
    </div>
  );
};

export default Financials;
