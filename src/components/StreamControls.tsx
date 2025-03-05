
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, StopCircle } from 'lucide-react';

interface StreamControlsProps {
  url: string;
  isConnected: boolean;
  onUrlChange: (url: string) => void;
  onToggleConnection: () => void;
}

const StreamControls = ({
  url,
  isConnected,
  onUrlChange,
  onToggleConnection,
}: StreamControlsProps) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2">
        <Badge variant={isConnected ? "default" : "secondary"}>
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="rtsp://your-camera-url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={onToggleConnection}
          variant={isConnected ? "destructive" : "default"}
          className="min-w-[120px] transition-all duration-200"
          disabled={!url}
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
    </div>
  );
};

export default StreamControls;
