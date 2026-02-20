'use client';

import React from 'react';

interface ConfirmResetModalProps {
  open: boolean;
  isBusy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmResetModal({
  open,
  isBusy = false,
  onConfirm,
  onCancel,
}: ConfirmResetModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative w-full max-w-md mx-4 bg-card border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white">Reset all fitness data?</h3>
        <p className="text-sm text-muted mt-2">
          This will delete your goals, meals, workouts, sleep logs, and steps. This action cannot be undone.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isBusy}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded-lg border border-white/10 hover:border-gray-500 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isBusy}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-60"
          >
            {isBusy ? 'Resetting...' : 'Reset Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
