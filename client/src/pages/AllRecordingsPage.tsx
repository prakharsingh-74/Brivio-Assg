import { useState, useEffect, useRef } from 'react';
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

  // Auto-select first recording
  useEffect(() => {
    if (recordings.length > 0 && !selectedRecording) {
      setSelectedRecording(recordings[0]);
    }
  }, [recordings, selectedRecording]);

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

  if (recordings.length === 0 && !isLoading) {
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
              onClick={() => setSelectedRecording(recording)}
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
                  <div className="text-sm text-gray-700 leading-relaxed">
                    <p className="mb-4">
                      Fugiat ipsum consequat aliquam ultrices lacus. Tellus lorem ipsum dolor sit amet, consectetur elit. Fugiat vel bibendum. Fusce vitae dolor lorem. Fusce vitae rutrum mi. Fusce vitae rutrum leo. Team tellus vitae porta lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor ut labore incididunt lorem nulla fugiat nulla pariatur et eusmod sunt in dolore magna aliqua. Tellus lorem ipsum dolor sit amet, consectetur elit, et eusmod sunt in dolore.
                    </p>
                    <p className="mb-4">
                      Tha fugit in duis hendrerit in excepteur consequat sunt incididunt ut labore et dolore magna aliqua et ultrices. Nulla fugiat nulla pariatur et eusmod sed eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus lorem ipsum dolor sit amet, consectetur elit. Sed duis hendrerit in ex eu irlure dolor in proident sunt in dolore magna aliqua, ut enim ad minim veniam, quis nostrud exercitation ultrices. Hendrerit dolor lorem ipsum dolor sit amet, consectetur elit adipiscing. Nulla fugiat nulla pariatur et eusmod sunt in dolore magna aliqua. Tellus lorem ipsum dolor sit amet, et eusmod sunt in dolore magna aliqua. Team tellus vitae porta lorem ipsum dolor sit amet, consectetur elit.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">AI Summary</label>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    <p className="mb-4">
                      Fugiat ipsum consequat aliquam ultrices lacus. Tellus lorem vitae tellus vitae lacus. Team tellus vitae porta lorem ipsum dolor sit amet, consectetur elit adipiscing. Fusce vitae rutrum leo. Team tellus vitae porta lorem ipsum dolor sit amet, consectetur elit.
                    </p>
                    <p className="mb-4">
                      Tha rutrum tellus vitae tellus vitae lacus. Fusce vitae rutrum leo. Tellus lorem vitae tellus vitae lacus. Sed eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus lorem lorem ipsum dolor sit amet, consectetur elit adipiscing. Hendrerit dolor lorem ipsum dolor sit amet, consectetur elit adipiscing. Nulla fugiat nulla pariatur et eusmod sunt in dolore magna aliqua. Tellus lorem ipsum dolor sit amet, consectetur elit adipiscing.
                    </p>
                    <p>
                      Lorem vitae tellus vitae lacus. Sed eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus lorem ipsum dolor sit amet, consectetur elit adipiscing. Hendrerit dolor lorem ipsum dolor sit amet, consectetur elit adipiscing.
                    </p>
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