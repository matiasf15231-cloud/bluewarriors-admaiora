import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    src: string;
    title: string;
    description: string;
  } | null;
}

const ImageModal = ({ isOpen, onClose, image }: ImageModalProps) => {
  if (!image) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden animate-scale-in border-0">
        <div className="relative bg-secondary/20">
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>
        <DialogHeader className="p-6 pt-4 bg-background rounded-b-lg">
          <DialogTitle className="text-2xl font-bold text-foreground">{image.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{image.description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;