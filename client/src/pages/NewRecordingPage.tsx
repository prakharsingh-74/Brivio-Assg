import { useState, useEffect } from 'react';
import { Spinner } from '../components/Spinner';
import { FileDropzone } from '../components/Upload/FileDropzone';
import { apiClient } from '../lib/api/client';
import { useRecordings } from '../hooks/useRecordings';

export function NewRecordingPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processingRecordingId, setProcessingRecordingId] = useState<string | null>(null);
  const { addRecording, updateRecording, recordings } = useRecordings();

  // Check if any recording is currently processing
  const hasProcessingRecording = recordings.some(r => r.status === 'processing');

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await apiClient.uploadRecording(file);
      
      // Add new recording to the list with processing status
      const newRecording = {
        id: response.id,
        userId: 'user1',
        title: file.name.replace('.mp3', ''),
        summary: 'Processing...',
        transcription: '',
        durationSec: 0,
        createdAt: new Date().toISOString(),
        status: 'processing' as const
      };
      
      addRecording(newRecording);
      setProcessingRecordingId(response.id);
      
      // Start polling for status updates
      pollRecordingStatus(response.id);
      
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const pollRecordingStatus = async (recordingId: string) => {
    const poll = async () => {
      try {
        const status = await apiClient.getRecordingStatus(recordingId);
        
        if (status.status === 'completed') {
          // Update recording with completed status and mock data
          updateRecording(recordingId, {
            status: 'completed',
            title: 'New Recording',
            summary: 'Analysis completed successfully.',
            durationSec: 185
          });
          setProcessingRecordingId(null);
        } else if (status.status === 'failed') {
          updateRecording(recordingId, {
            status: 'failed',
            summary: 'Processing failed.'
          });
          setProcessingRecordingId(null);
        } else {
          // Continue polling
          setTimeout(poll, 2000);
        }
      } catch (error) {
        console.error('Failed to check recording status:', error);
        setTimeout(poll, 2000);
      }
    };
    
    poll();
  };

  // Clear errors when component unmounts or processingRecordingId changes
  useEffect(() => {
    if (processingRecordingId) {
      setUploadError(null);
    }
  }, [processingRecordingId]);

  const isDisabled = isUploading || hasProcessingRecording;

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold text-gray-900">New Recording</h1>
      </div>
      
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {hasProcessingRecording && !isUploading ? (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-center text-gray-700 text-lg">
                Your last recording is processing. You'll have to wait<br />
                to upload a new recording.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Upload new recording to analyze
                </h2>
              </div>

              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}

              {isUploading && (
                <div className="flex flex-col items-center bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <Spinner />
                  <p className="text-sm text-blue-600 mt-2">Uploading and processing your recording...</p>
                </div>
              )}

              <FileDropzone
                onFileSelect={handleFileSelect}
                disabled={isDisabled}
                accept=".mp3"
              />

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Only MP3 files are supported</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}