import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthCard } from '../components/Auth/AuthCard';
import { AuthForm } from '../components/Auth/AuthForm';
import { InputField } from '../components/Auth/InputField';
import { apiClient } from '../lib/api/client';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors: typeof errors = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email.';
      valid = false;
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      valid = false;
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
      valid = false;
    }
    setErrors(newErrors);
    if (!valid) return;
    setIsSubmitting(true);
    try {
      await apiClient.signup(email, password, confirmPassword);
      setToast({ type: 'success', message: 'Signup successful!' });
      setTimeout(() => navigate('/login'), 1000);
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Signup failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="Brivio" subtitle="Create your account">
      {toast && (
        <div className={`mb-4 text-center text-sm rounded p-2 ${toast.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{toast.message}</div>
      )}
      <AuthForm onSubmit={handleSubmit} submitLabel="Sign Up" isSubmitting={isSubmitting}>
        <InputField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          required
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
          required
        />
        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />
      </AuthForm>
      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </div>
    </AuthCard>
  );
};
