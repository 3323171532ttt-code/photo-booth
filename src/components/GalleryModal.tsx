"use client";

import React, { useState } from "react";
import { X, Trash2, Download, Layers } from "lucide-react";
import { GalleryPhoto, deletePhotoFromGallery } from "@/lib/galleryStorage";
import { soundFX } from "@/lib/soundEffects";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: GalleryPhoto[];
  onPhotosUpdated: (updated: GalleryPhoto[]) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  photos,
  onPhotosUpdated,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  if (!isOpen) return null;

  const handleDelete = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    soundFX.playTap();
    if (confirm("Remove this print from your film roll?")) {
      const updated = await deletePhotoFromGallery(photoId);
      onPhotosUpdated(updated);
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto(null);
      }
    }
  };

  const handleDownload = (e: React.MouseEvent, photo: GalleryPhoto) => {
    e.stopPropagation();
    soundFX.playTap();
    const a = document.createElement("a");
    a.href = photo.dataUrl;
    a.download = `frame80-${photo.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#12100E]/90 backdrop-blur-md flex flex-col justify-between overflow-hidden select-none animate-eject">
      {/* Top Header */}
      <header className="flex items-center justify-between px-5 py-3 bg-gradient-to-b from-[#FAF7F0] to-[#EAE3D5] border-b border-[#C5BBA7] shadow-sm">
        <div className="flex items-center gap-2">
          <Layers className="w-4.5 h-4.5 text-[#5C5549]" />
          <h2 className="text-xs font-mono font-black uppercase tracking-wider text-[#3A3938]">
            FILM ROLL PRINTS ({photos.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            onClose();
          }}
          className="p-1.5 rounded-full bg-[#E8E1D3] hover:bg-[#DDD4C4] text-[#4A4039] border border-[#BDB29E] transition-colors btn-tactile cursor-pointer"
          aria-label="Close Gallery"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Main Grid Area: Physical Prints */}
      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full no-scrollbar">
        {photos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-400">
            <div className="w-16 h-16 rounded-2xl bg-[#25221F] border border-[#3E3833] flex items-center justify-center mb-3 shadow-inner">
              <Layers className="w-8 h-8 text-[#8C8477]" />
            </div>
            <p className="text-xs font-mono font-bold text-[#E8E1D3] mb-1 uppercase tracking-wider">
              FILM ROLL IS EMPTY
            </p>
            <p className="text-[11px] text-[#8C8477] max-w-xs leading-relaxed">
              Snap photos with the camera to start developing and collecting instant physical prints.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-8">
            {photos.map((photo) => {
              const dateStr = new Date(photo.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={photo.id}
                  onClick={() => {
                    soundFX.playTap();
                    setSelectedPhoto(photo);
                  }}
                  className="group relative bg-[#FAF7F0] p-2 pb-6 rounded-lg border border-[#D5CBB9] shadow-[0_8px_18px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center"
                >
                  {/* Photo aperture */}
                  <div className="w-full aspect-[4/4.5] rounded-xs overflow-hidden bg-[#12141C] border border-[#C5BBA7]/60">
                    <img
                      src={photo.dataUrl}
                      alt="Instant print"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Print footer */}
                  <div className="w-full flex items-center justify-between text-[8.5px] font-mono text-[#7C7468] mt-2 px-0.5">
                    <span className="truncate max-w-[65px] font-bold">
                      {photo.filmName}
                    </span>
                    <span>{dateStr}</span>
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => handleDownload(e, photo)}
                      className="p-1.5 rounded-full bg-black/80 text-white hover:bg-black shadow-sm btn-tactile cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, photo.id)}
                      className="p-1.5 rounded-full bg-[#D9534F] text-white hover:bg-red-700 shadow-sm btn-tactile cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Screen Print Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-eject"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-sm w-full bg-[#FAF7F0] p-3 pb-8 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-[#D5CBB9]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#2B2724] text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-black btn-tactile cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-full rounded-md overflow-hidden bg-black shadow-inner">
              <img
                src={selectedPhoto.dataUrl}
                alt="Full instant print"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#3A3938] font-mono">
                  {selectedPhoto.filmName}
                </span>
                <span className="text-[9.5px] text-[#7C7468] font-mono">
                  {new Date(selectedPhoto.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, selectedPhoto.id)}
                  className="p-2 rounded-lg bg-red-100 text-[#D9534F] hover:bg-red-200 transition-colors btn-tactile"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDownload(e, selectedPhoto)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#2B2724] text-[#FFA733] text-xs font-mono font-bold shadow-md hover:bg-black transition-colors btn-tactile"
                >
                  <Download className="w-3.5 h-3.5" />
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
