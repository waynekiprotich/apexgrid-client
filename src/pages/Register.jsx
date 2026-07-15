import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign in failed');
      }
    }
  };

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
      await register(form.email, form.password);
      // login is handled automatically by Firebase onAuthStateChanged, 
      // but we can explicitly call it or just navigate
      navigate('/dashboard');
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') errorMessage = 'Email is already in use.';
      if (err.code === 'auth/weak-password') errorMessage = 'Password is too weak.';
      
      setError(errorMessage);
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

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-muted">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center gap-3 py-2.5 px-4 border border-border rounded-lg shadow-sm bg-surface text-sm font-medium text-text hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54998L20.0303 3.125C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25528 2.69 1.28027 6.60998L5.27028 9.70498C6.21528 6.86 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21538 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>

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
