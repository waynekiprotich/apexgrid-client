import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts';
import { authApi } from '../services/resources';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      // Auto-login after register
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'yourname', autocomplete: 'username' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autocomplete: 'email' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '8+ characters', autocomplete: 'new-password' },
    { name: 'confirm', label: 'Confirm password', type: 'password', placeholder: '••••••••', autocomplete: 'new-password' },
  ];

  return (
    <AuthLayout>
      <div className="card p-8 animate-slide-up">
        <h2 className="text-xl font-bold text-text mb-1">Create account</h2>
        <p className="text-sm text-muted mb-6">Start tracking F1 data in seconds</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-xs font-medium text-muted mb-1">{f.label}</label>
              <input
                className="input"
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                autoComplete={f.autocomplete}
                value={form[f.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {error && (
            <div className="text-xs text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full justify-center py-2.5"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating account…
              </span>
            ) : 'Create account'}
          </button>
        </form>

        <p className="text-xs text-muted text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
