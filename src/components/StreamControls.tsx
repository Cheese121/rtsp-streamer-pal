
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, StopCircle, AlertTriangle } from 'lucide-react';

interface StreamControlsProps {
  url: string;
  isConnected: boolean;
  onUrlChange: (url: string) => void;
  onToggleConnection: () => void;
}

const RTSP_SERVER_URL = "rtsp://localhost:8554"; 

const StreamControls = ({
  url,
  isConnected,
  onUrlChange,
  onToggleConnection,
}: StreamControlsProps) => {
  // Check if URL is in correct format
  const isValidUrl = (url: string): boolean => {
    return url.trim().startsWith('rtsp://');
  };

  // Generate a hint/example based on the input
  const getUrlHint = (input: string): string => {
    if (!input) {
      return `Example: ${RTSP_SERVER_URL}/stream_name`;
    }
    
    // If they typed something that's not starting with rtsp://
    if (!input.startsWith('rtsp://')) {
      return `Hint: Use format ${RTSP_SERVER_URL}/${input}`;
    }
    
    return "";
  };
  
  const urlHint = getUrlHint(url);
  const validationError = url && !isValidUrl(url);

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2">
        <Badge variant={isConnected ? "default" : "secondary"}>
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
        
        {isConnected && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Using WebRTC via MediaMTX
          </Badge>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="flex gap-2">
          <Input
            placeholder="rtsp://localhost:8554/stream_name"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            className={`flex-1 ${validationError ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
          />
          <Button
            onClick={onToggleConnection}
            variant={isConnected ? "destructive" : "default"}
            className="min-w-[120px] transition-all duration-200"
            disabled={!url || validationError}
          >
            {isConnected ? (
              <>
                <StopCircle className="mr-2 h-4 w-4" />
                Disconnect
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Connect
              </>
            )}
          </Button>
        </div>
        
        {urlHint && !validationError && (
          <p className="text-xs text-gray-500 ml-1">{urlHint}</p>
        )}
        
        {validationError && (
          <div className="flex items-center text-xs text-red-500 ml-1 mt-1">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>URL must be in RTSP format (rtsp://...)</span>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <p>The RTSP stream will be converted to WebRTC for viewing.</p>
        <p className="mt-1">MediaMTX servers: WebRTC (8889), RTSP input (8554)</p>
      </div>
    </div>
  );
};

export default StreamControls;
