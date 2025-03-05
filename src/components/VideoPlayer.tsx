
import React from 'react';
import ReactPlayer from 'react-player';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  isConnected: boolean;
}

const VideoPlayer = ({ url, isConnected }: VideoPlayerProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    
    toast({
      title: "Connection Error",
      description: "Failed to connect to the RTSP stream. Please check that the URL is correct and the camera is accessible.",
      variant: "destructive",
    });
  };

  // Reset loading and error state when stream changes
  React.useEffect(() => {
    if (isConnected) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [url, isConnected]);

  return (
    <div className="relative w-full aspect-video bg-black/5 rounded-lg overflow-hidden backdrop-blur-sm border border-gray-200 shadow-sm">
      {isConnected ? (
        <>
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          )}
          
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-50/90">
              <AlertCircle className="w-10 h-10 text-destructive mb-2" />
              <h3 className="text-lg font-medium text-destructive">Connection Failed</h3>
              <p className="text-sm text-gray-600 text-center mt-1">
                Could not connect to the stream. Please verify:
              </p>
              <ul className="text-sm text-gray-600 mt-2 list-disc pl-5">
                <li>The RTSP URL is correct</li>
                <li>The camera is powered on and accessible</li>
                <li>Your network allows RTSP traffic</li>
              </ul>
            </div>
          )}
          
          <ReactPlayer
            url={url}
            width="100%"
            height="100%"
            playing={isConnected && !hasError}
            onError={handleError}
            onBufferEnd={() => setIsLoading(false)}
            style={{ opacity: isLoading || hasError ? 0 : 1 }}
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
