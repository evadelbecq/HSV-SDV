// app/dashboard/layout.tsx
import React from 'react';

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black">
      {children}
    </div>
  );
}