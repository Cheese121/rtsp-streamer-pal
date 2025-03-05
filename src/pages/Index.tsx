
import React, { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import StreamControls from '@/components/StreamControls';

const Index = () => {
  const [rtspUrl, setRtspUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleToggleConnection = () => {
    if (!rtspUrl && !isConnected) {
      return;
    }
    setIsConnected(!isConnected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">RTSP Stream Viewer</h1>
          <p className="text-gray-500">Connect to your RTSP camera feed</p>
        </div>
        
        <VideoPlayer url={rtspUrl} isConnected={isConnected} />
        
        <StreamControls
          url={rtspUrl}
          isConnected={isConnected}
          onUrlChange={setRtspUrl}
          onToggleConnection={handleToggleConnection}
        />
      </div>
    </div>
  );
};

export default Index;
