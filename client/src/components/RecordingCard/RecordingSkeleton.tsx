import React from 'react';

export function RecordingSkeleton() {
  return (
    <div className="p-4 border-b border-gray-200 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
      
      <div className="space-y-1 mb-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}