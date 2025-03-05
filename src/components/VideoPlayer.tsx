
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';

interface VideoPlayerProps {
  url: string;
  isConnected: boolean;
}

// MediaMTX WebRTC Server URLs
const WEBRTC_HTTP_URL = "http://localhost:8889";
const HLS_FALLBACK_URL = "http://localhost:8888";

const VideoPlayer = ({ url, isConnected }: VideoPlayerProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [streamUrl, setStreamUrl] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const retryTimerRef = useRef<number | null>(null);

  // Convert RTSP URL to WebRTC URL for MediaMTX
  const convertToWebRtcUrl = (rtspUrl: string): string => {
    try {
      // Extract the path from the RTSP URL (after rtsp://server:port/)
      const urlObj = new URL(rtspUrl);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      // The stream name/path is the last part of the URL
      const streamPath = pathParts.join('/');
      
      // Construct the WebRTC URL for MediaMTX
      return `${WEBRTC_HTTP_URL}/stream/${streamPath}`;
    } catch (error) {
      console.error("Failed to parse RTSP URL:", error);
      return "";
    }
  };

  // Convert to HLS URL for fallback
  const convertToHlsUrl = (rtspUrl: string): string => {
    try {
      const urlObj = new URL(rtspUrl);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const streamPath = pathParts.join('/');
      
      return `${HLS_FALLBACK_URL}/${streamPath}/index.m3u8`;
    } catch (error) {
      console.error("Failed to parse RTSP URL for HLS:", error);
      return "";
    }
  };

  const handleError = () => {
    console.error("Stream error occurred");
    
    if (!usingFallback) {
      // Try switching to HLS fallback
      setUsingFallback(true);
      setIsLoading(true);
      setStreamUrl(convertToHlsUrl(url));
      
      toast({
        title: "Switching to fallback",
        description: "WebRTC connection failed. Attempting to use HLS streaming as fallback.",
        variant: "default",
      });
    } else {
      // Both WebRTC and HLS failed
      setHasError(true);
      setIsLoading(false);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to the stream. Please check that the URL is correct and the camera is accessible.",
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setUsingFallback(false);
    setRetryCount(count => count + 1);
    
    toast({
      title: "Reconnecting",
      description: "Attempting to reconnect to the stream...",
    });
  };

  // Schedule auto-retry if error persists
  useEffect(() => {
    if (hasError && retryTimerRef.current === null) {
      retryTimerRef.current = window.setTimeout(() => {
        retryTimerRef.current = null;
        if (hasError && isConnected) {
          handleRetry();
        }
      }, 30000); // Auto-retry after 30 seconds
    }
    
    return () => {
      if (retryTimerRef.current !== null) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [hasError, isConnected]);

  // Update URLs when the original URL changes or connection state changes
  useEffect(() => {
    if (isConnected && url) {
      setIsLoading(true);
      setHasError(false);
      setUsingFallback(false);
      setStreamUrl(convertToWebRtcUrl(url));
    } else {
      setStreamUrl("");
    }
  }, [url, isConnected, retryCount]);

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
                <li>MediaMTX server is running (localhost:8889)</li>
                <li>The camera is powered on and accessible</li>
                <li>Your network allows WebRTC/RTSP traffic</li>
              </ul>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={handleRetry}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
            </div>
          )}
          
          {streamUrl && (
            <ReactPlayer
              key={`${streamUrl}-${usingFallback ? 'hls' : 'webrtc'}`}
              url={streamUrl}
              width="100%"
              height="100%"
              playing={isConnected && !hasError}
              onError={handleError}
              onBufferEnd={() => setIsLoading(false)}
              onReady={() => setIsLoading(false)}
              style={{ opacity: isLoading || hasError ? 0 : 1 }}
              config={{
                file: {
                  attributes: {
                    crossOrigin: "anonymous",
                  },
                  forceVideo: true,
                  forceHLS: usingFallback,
                },
              }}
            />
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">No active stream</p>
        </div>
      )}
      
      {usingFallback && isConnected && !hasError && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
          Using HLS Fallback
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
