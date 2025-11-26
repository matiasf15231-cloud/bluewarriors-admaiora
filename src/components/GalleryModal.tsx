import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaItem {
  src: string;
  title: string;
  description: string;
  type: 'photo' | 'video';
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem[];
  startIndex?: number;
}

const GalleryModal = ({ isOpen, onClose, media, startIndex = 0 }: GalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
    }
  }, [startIndex, isOpen]);

  useEffect(() => {
    // Pause video when modal is closed or when navigating away
    return () => {
      const videoElement = document.querySelector('.gallery-video');
      if (videoElement instanceof HTMLVideoElement) {
        videoElement.pause();
      }
    };
  }, [isOpen, currentIndex]);

  if (!media || media.length === 0) {
    return null;
  }

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const currentMedia = media[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden animate-scale-in border-0">
        <div className="relative bg-secondary/20 flex items-center justify-center p-4 aspect-video">
          {currentMedia.type === 'photo' ? (
            <img
              src={currentMedia.src}
              alt={currentMedia.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              key={currentIndex}
            />
          ) : (
            <video
              src={currentMedia.src}
              controls
              autoPlay
              muted
              className="gallery-video max-w-full max-h-full object-contain rounded-lg shadow-lg"
              key={currentIndex}
            >
              Tu navegador no soporta la etiqueta de video.
            </video>
          )}
          
          {media.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="group absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={prevMedia}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="group absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={nextMedia}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm font-medium">
                {currentIndex + 1} / {media.length}
              </div>
            </>
          )}
        </div>
        <DialogHeader className="p-6 pt-4 bg-background rounded-b-lg">
          <DialogTitle className="text-2xl font-bold text-foreground">{currentMedia.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{currentMedia.description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;