import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Import robot prototype images
import prototype1_1 from '@/assets/prototype-1-1.png';
import prototype1_2 from '@/assets/prototype-1-2.png';
import prototype1_3 from '@/assets/prototype-1-3.png';
import prototype1_4 from '@/assets/prototype-1-4.png';
import prototype1_5 from '@/assets/prototype-1-5.png';
import prototype1_6 from '@/assets/prototype-1-6.png';

const photos = [
  { src: prototype1_1, alt: 'Robot Prototipo #1 - Vista frontal', description: 'Vista frontal del robot con estructura de soporte' },
  { src: prototype1_2, alt: 'Robot Prototipo #1 - Vista lateral', description: 'Vista lateral mostrando el SpikePrime y cables' },
  { src: prototype1_3, alt: 'Robot Prototipo #1 - Vista trasera', description: 'Vista trasera del robot prototipo' },
  { src: prototype1_4, alt: 'Robot Prototipo #1 - Otra vista lateral', description: 'Vista lateral derecha con detalles de construcción' },
  { src: prototype1_5, alt: 'Robot Prototipo #1 - Vista interior', description: 'Vista interior mostrando componentes internos' },
  { src: prototype1_6, alt: 'Robot Prototipo #1 - Vista superior', description: 'Vista superior con SpikePrime visible' },
];

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prototypeTitle: string;
}

const PhotoGalleryModal = ({ isOpen, onClose, prototypeTitle }: PhotoGalleryModalProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Galería de Fotos - {prototypeTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Explora las diferentes vistas y detalles del robot prototipo
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Image Display */}
          <div className="flex-1 relative bg-secondary/20 flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full">
              <img
                src={photos[currentPhotoIndex].src}
                alt={photos[currentPhotoIndex].alt}
                className="max-w-2xl max-h-96 object-contain rounded-lg shadow-lg"
              />
              
              {/* Navigation Buttons */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={prevPhoto}
                disabled={photos.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={nextPhoto}
                disabled={photos.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Photo Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm font-medium">
                {currentPhotoIndex + 1} / {photos.length}
              </div>
            </div>
          </div>

          {/* Photo Description */}
          <div className="p-4 border-t bg-background">
            <p className="text-center text-muted-foreground font-medium">
              {photos[currentPhotoIndex].description}
            </p>
          </div>

          {/* Thumbnail Strip */}
          <div className="px-6 pb-6">
            <div className="flex gap-2 justify-center overflow-x-auto pb-2">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => goToPhoto(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-smooth ${
                    index === currentPhotoIndex
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoGalleryModal;