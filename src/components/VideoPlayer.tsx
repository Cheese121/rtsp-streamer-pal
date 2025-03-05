
import React from 'react';
import ReactPlayer from 'react-player';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  isConnected: boolean;
}

const VideoPlayer = ({ url, isConnected }: VideoPlayerProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);

  const handleError = () => {
    toast({
      title: "Connection Error",
      description: "Failed to connect to the RTSP stream. Please check the URL and try again.",
      variant: "destructive",
    });
    setIsLoading(false);
  };

  // Reset loading state when stream changes
  React.useEffect(() => {
    if (isConnected) {
      setIsLoading(true);
    }
  }, [url, isConnected]);

  return (
    <div className="relative w-full aspect-video bg-black/5 rounded-lg overflow-hidden backdrop-blur-sm border border-gray-200 shadow-sm">
      {isConnected ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          )}
          <ReactPlayer
            url={url}
            width="100%"
            height="100%"
            playing={isConnected}
            onError={handleError}
            onBufferEnd={() => setIsLoading(false)}
            style={{ opacity: isLoading ? 0 : 1 }}
            config={{
              file: {
                attributes: {
                  crossOrigin: "anonymous",
                },
              },
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">No active stream</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
