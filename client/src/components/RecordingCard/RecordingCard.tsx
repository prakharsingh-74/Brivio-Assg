import { Recording } from '../../types';
import { formatDuration, formatRelativeTime } from '../../lib/utils';

interface RecordingCardProps {
  recording: Recording;
  onClick?: () => void;
  isSelected?: boolean;
}

export function RecordingCard({ recording, onClick, isSelected = false }: RecordingCardProps) {
  return (
    <div
      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 text-sm">{recording.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatRelativeTime(recording.createdAt)}</span>
          <span>{formatDuration(recording.durationSec)}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
        {recording.summary}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-400">
          {new Date(recording.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
        
        {recording.status === 'processing' && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Processing
          </span>
        )}
        
        {recording.status === 'failed' && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        )}
      </div>
    </div>
  );
}