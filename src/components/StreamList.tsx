
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Monitor } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface StreamListProps {
  streams: Array<{
    id: string;
    name: string;
    url: string;
    isConnected: boolean;
  }>;
  currentStreamId: string | null;
  onAdd: (name: string, url: string) => void;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
}

const StreamList = ({
  streams,
  currentStreamId,
  onAdd,
  onRemove,
  onSelect,
}: StreamListProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStreamName, setNewStreamName] = useState('');
  const [newStreamUrl, setNewStreamUrl] = useState('');

  const handleAddStream = () => {
    if (newStreamUrl.trim()) {
      onAdd(newStreamName.trim(), newStreamUrl.trim());
      setNewStreamName('');
      setNewStreamUrl('');
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Stream Sources</h2>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[300px]">
        {streams.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No streams added yet</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {streams.map((stream) => (
              <div
                key={stream.id}
                className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                  currentStreamId === stream.id
                    ? 'bg-primary/10'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div 
                  className="flex-1 cursor-pointer flex items-center"
                  onClick={() => onSelect(stream.id)}
                >
                  <div className={`h-2 w-2 rounded-full mr-2 ${
                    stream.isConnected ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div className="truncate">
                    <div className="font-medium">{stream.name}</div>
                    <div className="text-xs text-gray-500 truncate">{stream.url}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onSelect(stream.id)}
                    className="h-8 w-8"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onRemove(stream.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Stream</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Stream Name</label>
              <Input
                placeholder="Living Room Camera"
                value={newStreamName}
                onChange={(e) => setNewStreamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">RTSP URL</label>
              <Input
                placeholder="rtsp://your-camera-url"
                value={newStreamUrl}
                onChange={(e) => setNewStreamUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStream}>
              Add Stream
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StreamList;
