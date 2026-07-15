import React from 'react';

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    {icon && <div className="text-5xl mb-4 opacity-40">{icon}</div>}
    <h3 className="text-base font-semibold text-text mb-1">{title}</h3>
    {description && <p className="text-sm text-muted mb-5 max-w-xs">{description}</p>}
    {action && action}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
      <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <p className="text-sm text-muted mb-4">{message || 'Something went wrong'}</p>
    {onRetry && (
      <button className="btn-outline text-xs" onClick={onRetry}>Try again</button>
    )}
  </div>
);
