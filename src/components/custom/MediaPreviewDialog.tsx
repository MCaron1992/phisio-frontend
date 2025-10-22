'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  open: boolean;
  title?: string;
  foto?: string;
  video?: string;
  onClose: () => void;
};

const MediaPreviewDialog = ({
  open,
  title,
  foto,
  video,
  onClose,
}: Props) => {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {title &&
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        }

        <div className="w-full flex flex-col items-center">
          {foto ? (
            <div className="relative w-64 h-64 flex justify-center items-center">
              <img
                src={foto}
                alt="Anteprima immagine"
                className="w-full h-full object-cover rounded-md shadow-sm"
              />
            </div>
          ) : (
            <div className="w-64 h-64 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 mb-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0l5.586 5.586a2 2 0 002.828 0L17 7m-5 8h.01"
                />
              </svg>
              <p className="font-medium">Immagine assente</p>
            </div>

          )}
        </div>

        <div className="w-full flex flex-col items-center">
          {video ? (
            <div className="relative w-64 h-64 flex justify-center items-center">
              <video
                src={video}
                controls
                className="w-full h-full object-cover rounded-md shadow-sm"
              />
            </div>
          ) : (
            <div className="w-64 h-64 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 mb-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-3 0a9 9 0 110-18 9 9 0 010 18zm0 0V21"
                />
              </svg>
              <p className="font-medium">Video assente</p>
            </div>

          )}
        </div>


      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewDialog;