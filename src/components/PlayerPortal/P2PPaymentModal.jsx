import React, { useState } from 'react';

const P2PPaymentModal = ({ onClose, onConfirm, outstandingBalance }) => {
  const [paymentMethod, setPaymentMethod] = useState('venmo');
  const [amount, setAmount] = useState(outstandingBalance);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = () => {
    setError(null);

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!confirmationNumber.trim()) {
      setError('Please enter a transaction ID or confirmation number');
      return;
    }

    onConfirm({
      paymentMethod,
      amount,
      confirmationNumber: confirmationNumber.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-borderLight p-6 brutal-clip max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-black text-dark uppercase">P2P Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-dark transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3 mb-6">
          <p className="font-mono text-[10px] text-gray-500 uppercase font-bold">
            Choose Payment Method
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-borderLight rounded cursor-pointer hover:bg-clinical transition-colors">
              <input
                type="radio"
                name="method"
                value="venmo"
                checked={paymentMethod === 'venmo'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-brand"
              />
              <div>
                <p className="font-display font-bold text-dark">💚 Venmo</p>
                <p className="font-mono text-[10px] text-gray-500">Fast and easy</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-borderLight rounded cursor-pointer hover:bg-clinical transition-colors">
              <input
                type="radio"
                name="method"
                value="cashapp"
                checked={paymentMethod === 'cashapp'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-brand"
              />
              <div>
                <p className="font-display font-bold text-dark">📱 Cash App</p>
                <p className="font-mono text-[10px] text-gray-500">Instant transfer</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-borderLight rounded cursor-pointer hover:bg-clinical transition-colors">
              <input
                type="radio"
                name="method"
                value="transfer"
                checked={paymentMethod === 'transfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-brand"
              />
              <div>
                <p className="font-display font-bold text-dark">🏦 Direct Transfer</p>
                <p className="font-mono text-[10px] text-gray-500">ACH or wire</p>
              </div>
            </label>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full text-center p-4 border-2 border-dashed border-brand/50 rounded hover:bg-clinical transition-colors"
          >
            <p className="font-display font-black text-brand text-sm mb-1">📱 {showQR ? 'Hide' : 'Show'} QR Code</p>
            <p className="font-mono text-[10px] text-gray-500">Tap to scan and send</p>
          </button>

          {showQR && (
            <div className="mt-4 p-4 bg-clinical border border-borderLight text-center rounded">
              <div className="w-48 h-48 mx-auto bg-white border-4 border-dark flex items-center justify-center">
                <p className="font-mono text-xs text-gray-400 text-center">
                  [QR Code Placeholder]
                  <br />
                  Scan to send payment
                </p>
              </div>
              <p className="font-mono text-[10px] text-gray-500 mt-2">
                athleteiq.venmo.com/{paymentMethod}
              </p>
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
            Payment Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 font-display font-black text-dark">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              className="w-full pl-8 pr-3 py-2 bg-clinical border border-borderDark outline-none focus:border-brand text-sm"
            />
          </div>
          <p className="font-mono text-[10px] text-gray-400 mt-1">
            Outstanding: ${outstandingBalance.toFixed(2)}
          </p>
        </div>

        {/* Transaction ID / Confirmation */}
        <div className="mb-6">
          <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
            Transaction ID / Confirmation Number
          </label>
          <input
            type="text"
            value={confirmationNumber}
            onChange={(e) => setConfirmationNumber(e.target.value)}
            placeholder="e.g., TXN123456789"
            className="w-full px-3 py-2 bg-clinical border border-borderDark outline-none focus:border-brand text-sm font-mono"
          />
          <p className="font-mono text-[10px] text-gray-400 mt-1">
            Enter the ID from your payment app for audit trail
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-900 text-xs p-3 font-mono rounded">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-dark text-dark font-display font-black text-sm py-3 hover:bg-clinical transition-colors rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-brand text-dark font-display font-black text-sm py-3 brutal-clip hover:bg-dark hover:text-brand transition-all"
          >
            Confirm Payment
          </button>
        </div>

        <p className="font-mono text-[10px] text-gray-400 text-center mt-4">
          Your transaction will be recorded immediately.
        </p>
      </div>
    </div>
  );
};

export default P2PPaymentModal;
