import React from 'react';

// Generic skeleton block
export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

// Skeleton for a stat card row
export const SkeletonStatRow = () => (
  <div className="flex flex-col gap-1.5">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-7 w-32" />
  </div>
);

// Skeleton card
export const SkeletonCard = ({ lines = 3 }) => (
  <div className="card p-5 space-y-3">
    <Skeleton className="h-4 w-1/3" />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

// Skeleton table row
export const SkeletonTableRow = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="py-3 px-4">
        <Skeleton className="h-3.5 w-full" />
      </td>
    ))}
  </tr>
);
