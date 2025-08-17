import React from 'react';

export interface AuthFormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitLabel: string;
  isSubmitting: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, children, submitLabel, isSubmitting }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {children}
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      disabled={isSubmitting}
    >
      {isSubmitting ? submitLabel + '...' : submitLabel}
    </button>
  </form>
);
