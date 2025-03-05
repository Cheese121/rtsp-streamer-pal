
import React, { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import StreamControls from '@/components/StreamControls';
import StreamList from '@/components/StreamList';
import { useToast } from '@/hooks/use-toast';
import { Info } from 'lucide-react';

// Define a type for our stream objects
interface Stream {
  id: string;
  name: string;
  url: string;
  isConnected: boolean;
}

// App version
const APP_VERSION = "1.1.0";

const Index = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get the current stream object
  const currentStream = streams.find(stream => stream.id === currentStreamId) || null;

  // Add a new stream
  const handleAddStream = (name: string, url: string) => {
    const newStream: Stream = {
      id: Date.now().toString(),
      name: name || `Stream ${streams.length + 1}`,
      url,
      isConnected: false
    };
    
    setStreams([...streams, newStream]);
    
    // If this is the first stream, select it
    if (streams.length === 0) {
      setCurrentStreamId(newStream.id);
    }
    
    toast({
      title: "Stream Added",
      description: `Added stream: ${newStream.name}`,
    });
  };

  // Remove a stream
  const handleRemoveStream = (id: string) => {
    setStreams(streams.filter(stream => stream.id !== id));
    
    // If we're removing the current stream, select another one
    if (currentStreamId === id) {
      const remainingStreams = streams.filter(stream => stream.id !== id);
      setCurrentStreamId(remainingStreams.length > 0 ? remainingStreams[0].id : null);
    }
    
    toast({
      title: "Stream Removed",
      description: "Stream has been removed",
    });
  };

  // Select a stream
  const handleSelectStream = (id: string) => {
    setCurrentStreamId(id);
  };

  // Toggle stream connection
  const handleToggleConnection = (id: string) => {
    setStreams(streams.map(stream => {
      if (stream.id === id) {
        return { ...stream, isConnected: !stream.isConnected };
      }
      return stream;
    }));
  };

  // Update stream URL
  const handleUrlChange = (id: string, url: string) => {
    setStreams(streams.map(stream => {
      if (stream.id === id) {
        return { ...stream, url };
      }
      return stream;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 relative">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">RTSP Stream Viewer</h1>
          <p className="text-gray-500">Manage multiple RTSP camera feeds via WebRTC</p>
        </div>
        
        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-4">
            <StreamList 
              streams={streams}
              currentStreamId={currentStreamId}
              onAdd={handleAddStream}
              onRemove={handleRemoveStream}
              onSelect={handleSelectStream}
            />
          </div>
          
          <div className="space-y-4">
            <VideoPlayer 
              url={currentStream?.url || ''} 
              isConnected={!!currentStream?.isConnected} 
            />
            
            {currentStream && (
              <StreamControls
                url={currentStream.url}
                isConnected={currentStream.isConnected}
                onUrlChange={(url) => handleUrlChange(currentStream.id, url)}
                onToggleConnection={() => handleToggleConnection(currentStream.id)}
              />
            )}
            
            {!currentStream && (
              <div className="p-4 text-center bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">Select or add a stream to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Version number in bottom right */}
      <div className="fixed bottom-3 right-3 flex items-center text-xs text-gray-500 bg-white/80 backdrop-blur-sm py-1 px-2 rounded-full shadow-sm border border-gray-200">
        <Info className="w-3 h-3 mr-1" />
        <span>v{APP_VERSION}</span>
      </div>
    </div>
  );
};

export default Index;
