'use client';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-[#111827] border border-gray-800 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}