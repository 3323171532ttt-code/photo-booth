"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { FILM_PRESETS, FilmPreset, DEFAULT_ADJUSTMENTS } from "@/lib/filmPresets";
import { PhotoCaptureResult } from "@/lib/types";
import { soundFX } from "@/lib/soundEffects";
import { getGalleryPhotos, GalleryPhoto } from "@/lib/galleryStorage";
import { RetroChassis } from "@/components/RetroChassis";
import { CameraHeader } from "@/components/CameraHeader";
import { FilmSlot } from "@/components/FilmSlot";
import { CameraView, CameraViewHandle } from "@/components/CameraView";
import { CameraControls } from "@/components/CameraControls";
import { Countdown } from "@/components/Countdown";
import { FlashOverlay } from "@/components/FlashOverlay";
import { FilmSelector } from "@/components/FilmSelector";
import { DevelopingPhoto } from "@/components/DevelopingPhoto";
import { PhotoEditor } from "@/components/PhotoEditor";
import { GalleryModal } from "@/components/GalleryModal";

export default function RetroCameraApp() {
  const cameraRef = useRef<CameraViewHandle>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  // App Main States: "CAMERA" | "DEVELOPING" | "EDITING"
  const [appState, setAppState] = useState<"CAMERA" | "DEVELOPING" | "EDITING">("CAMERA");

  // Camera Settings
  const [filmCount, setFilmCount] = useState<number>(8);
  const [selectedFilm, setSelectedFilm] = useState<FilmPreset>(FILM_PRESETS[0]);
  const [flashMode, setFlashMode] = useState<"on" | "off">("on");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Capture Animations
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Captured Photo Result
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoCaptureResult | null>(null);

  // Modals & Drawers
  const [isFilmSelectorOpen, setIsFilmSelectorOpen] = useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    getGalleryPhotos().then((photos) => {
      setGalleryPhotos(photos);
    });
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playTap();
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Initiate Photo Capture sequence
  const handleTriggerCapture = useCallback(() => {
    if (countdown !== null || appState !== "CAMERA") return;

    let currentCount = 3;
    setCountdown(currentCount);
    soundFX.playCountdownBeep(false);

    const interval = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdown(currentCount);
        soundFX.playCountdownBeep(false);
      } else {
        clearInterval(interval);
        setCountdown(null);
        executeCapture();
      }
    }, 1000);
  }, [appState, countdown]);

  const executeCapture = () => {
    soundFX.playCountdownBeep(true);

    // Strobe Flash
    if (flashMode === "on") {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 450);
    }

    // Camera recoil shake
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 350);

    // Capture frame
    const frame = cameraRef.current?.captureFrame();
    if (!frame) {
      console.warn("Could not capture video frame.");
      return;
    }

    soundFX.playShutter();

    const result: PhotoCaptureResult = {
      rawImage: frame.dataUrl,
      width: frame.width,
      height: frame.height,
      timestamp: Date.now(),
      filmPreset: selectedFilm,
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      frameId: "classic_white",
      stickers: [],
      textItems: [],
      dateStamp: {
        enabled: true,
        type: "date",
        customText: "RETRO '86",
        color: "#ff7a00",
        x: 18,
        y: 92,
        scale: 1,
      },
    };

    setCapturedPhoto(result);
    setAppState("DEVELOPING");
    setFilmCount((prev) => Math.max(0, prev - 1));
  };

  const handleImageUploaded = (dataUrl: string, width: number, height: number) => {
    soundFX.playShutter();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);

    const result: PhotoCaptureResult = {
      rawImage: dataUrl,
      width,
      height,
      timestamp: Date.now(),
      filmPreset: selectedFilm,
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      frameId: "classic_white",
      stickers: [],
      textItems: [],
      dateStamp: {
        enabled: true,
        type: "date",
        customText: "RETRO '86",
        color: "#ff7a00",
        x: 18,
        y: 92,
        scale: 1,
      },
    };
    setCapturedPhoto(result);
    setAppState("DEVELOPING");
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setAppState("CAMERA");
  };

  return (
    <RetroChassis isShaking={isShaking}>
      {/* Hidden File Input for fallback uploads */}
      <input
        ref={hiddenFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              handleImageUploaded(event.target?.result as string, img.width, img.height);
            };
            img.src = event.target?.result as string;
          };
          reader.readAsDataURL(file);
        }}
      />

      {/* STATE 1: CAMERA SCREEN */}
      {appState === "CAMERA" && (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Physical Top Camera Header */}
          <CameraHeader
            filmCount={filmCount}
            flashMode={flashMode}
            onToggleFlash={() => setFlashMode((prev) => (prev === "on" ? "off" : "on"))}
            onSwitchCamera={handleSwitchCamera}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            hasMultipleCameras={true}
          />

          {/* Physical Horizontal Film Output Slot */}
          <FilmSlot />

          {/* Center Viewfinder */}
          <div className="relative flex-1 w-full overflow-hidden">
            <CameraView
              ref={cameraRef}
              filmPreset={selectedFilm}
              facingMode={facingMode}
              onImageSelected={handleImageUploaded}
            />

            {/* Countdown Overlay */}
            <Countdown count={countdown} />

            {/* Flash Strobe Overlay */}
            <FlashOverlay isFlashing={isFlashing} />
          </div>

          {/* Bottom Physical Controls */}
          <CameraControls
            currentFilm={selectedFilm}
            onOpenFilmSelector={() => setIsFilmSelectorOpen(true)}
            onSelectFilmQuick={(f) => setSelectedFilm(f)}
            onShutterPress={handleTriggerCapture}
            onOpenGallery={() => setIsGalleryOpen(true)}
            onTriggerUpload={() => hiddenFileInputRef.current?.click()}
            disabled={countdown !== null}
            latestPhotoThumbnail={galleryPhotos[0]?.dataUrl}
            galleryCount={galleryPhotos.length}
          />

          {/* Film Selection Drawer */}
          <FilmSelector
            isOpen={isFilmSelectorOpen}
            onClose={() => setIsFilmSelectorOpen(false)}
            selectedFilm={selectedFilm}
            onSelectFilm={(film) => {
              setSelectedFilm(film);
              setIsFilmSelectorOpen(false);
            }}
          />
        </div>
      )}

      {/* DEVELOPING SCREEN: PHOTO EMERGES DIRECTLY FROM THE FILM SLOT */}
      {appState === "DEVELOPING" && capturedPhoto && (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          <CameraHeader
            filmCount={filmCount}
            flashMode={flashMode}
            onToggleFlash={() => {}}
            onSwitchCamera={() => {}}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            hasMultipleCameras={false}
          />

          <FilmSlot isEjecting={true} />

          <div className="relative flex-1 w-full overflow-hidden">
            <DevelopingPhoto
              photoDataUrl={capturedPhoto.rawImage}
              filmPreset={capturedPhoto.filmPreset}
              onDevelopingComplete={() => setAppState("EDITING")}
            />
          </div>
        </div>
      )}

      {/* STATE 2: PHOTO RESULT / EDITING SCREEN */}
      {appState === "EDITING" && capturedPhoto && (
        <PhotoEditor
          photoData={capturedPhoto}
          onRetake={handleRetake}
          onSavedToGallery={() => {
            getGalleryPhotos().then(setGalleryPhotos);
          }}
        />
      )}

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        photos={galleryPhotos}
        onPhotosUpdated={setGalleryPhotos}
      />
    </RetroChassis>
  );
}
