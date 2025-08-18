import { useState, useEffect, useRef } from 'react';
import { Spinner } from '../components/Spinner';
import { apiClient } from '../lib/api/client';
import { RecordingCard } from '../components/RecordingCard/RecordingCard';
import { RecordingSkeleton } from '../components/RecordingCard/RecordingSkeleton';
import { useRecordings } from '../hooks/useRecordings';
import { Recording } from '../types';

export function AllRecordingsPage() {
  const { recordings, isLoading, error, hasMore, loadMore } = useRecordings();
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll implementation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, loadMore]);


  // Auto-select first recording and fetch details
  useEffect(() => {
    const fetchDetails = async (rec: Recording) => {
      try {
        const details = await apiClient.getRecordingDetails(rec.id);
        setSelectedRecording(details);
      } catch {
        setSelectedRecording(rec);
      }
    };
    if (recordings.length > 0 && !selectedRecording) {
      fetchDetails(recordings[0]);
    }
  }, [recordings, selectedRecording]);

  // Fetch details when a new recording is selected
  const handleSelectRecording = async (rec: Recording) => {
    try {
      const details = await apiClient.getRecordingDetails(rec.id);
      setSelectedRecording(details);
    } catch {
      setSelectedRecording(rec);
    }
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load recordings</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No recordings yet</p>
          <p className="text-sm">Upload your first recording to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Recordings List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">All Recordings</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {recordings.map((recording) => (
            <RecordingCard
              key={recording.id}
              recording={recording}
              isSelected={selectedRecording?.id === recording.id}
              onClick={() => handleSelectRecording(recording)}
            />
          ))}
          
          {isLoading && (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <RecordingSkeleton key={`skeleton-${index}`} />
              ))}
            </>
          )}
          
          {/* Infinite scroll trigger */}
          <div ref={observerRef} className="h-1" />
        </div>
      </div>

      {/* Recording Details */}
      <div className="flex-1 bg-gray-50">
        {selectedRecording ? (
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recording Analysis</h2>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <p className="text-sm text-gray-900">{selectedRecording.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedRecording.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Duration</label>
                  <p className="text-sm text-gray-900">
                    {Math.floor(selectedRecording.durationSec / 60)}:{(selectedRecording.durationSec % 60).toString().padStart(2, '0')}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Original Transcription</label>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedRecording.transcription || <span className="italic text-gray-400">No transcription available.</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">AI Summary</label>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedRecording.summary || <span className="italic text-gray-400">No summary available.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Select a recording to view its analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}