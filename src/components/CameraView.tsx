"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Camera, Image as ImageIcon, RefreshCw } from "lucide-react";
import { FilmPreset } from "@/lib/filmPresets";

export interface CameraViewHandle {
  captureFrame: () => { dataUrl: string; width: number; height: number } | null;
}

interface CameraViewProps {
  filmPreset: FilmPreset;
  facingMode: "user" | "environment";
  onCameraReady?: () => void;
  onImageSelected?: (dataUrl: string, width: number, height: number) => void;
}

export const CameraView = forwardRef<CameraViewHandle, CameraViewProps>(
  ({ filmPreset, facingMode, onCameraReady, onImageSelected }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [hasCamera, setHasCamera] = useState<boolean>(true);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Initialize media stream
    useEffect(() => {
      let stream: MediaStream | null = null;
      let isMounted = true;

      async function startCamera() {
        setIsLoading(true);
        setCameraError(null);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMounted) {
            setHasCamera(false);
            setCameraError("Camera is not supported on this browser or connection.");
            setIsLoading(false);
          }
          return;
        }

        try {
          const constraints: MediaStreamConstraints = {
            audio: false,
            video: {
              facingMode: facingMode,
              width: { ideal: 1920 },
              height: { ideal: 1440 },
            },
          };

          stream = await navigator.mediaDevices.getUserMedia(constraints);

          if (!isMounted) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              if (isMounted) {
                videoRef.current?.play().catch(() => {});
                setIsLoading(false);
                setHasCamera(true);
                onCameraReady?.();
              }
            };
          }
        } catch (err: unknown) {
          console.warn("Camera start error:", err);
          if (isMounted) {
            setIsLoading(false);
            setHasCamera(false);
            const error = err as Error;
            if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
              setCameraError(
                "Camera access is off. Please allow camera access in your browser settings to take a photo."
              );
            } else {
              setCameraError(
                "Unable to access the camera. You can still upload a photo or retry."
              );
            }
          }
        }
      }

      startCamera();

      return () => {
        isMounted = false;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [facingMode, onCameraReady]);

    // Expose captureFrame method to parent
    useImperativeHandle(ref, () => ({
      captureFrame: () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2) return null;

        const w = video.videoWidth || 1280;
        const h = video.videoHeight || 960;
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        // Mirror front camera horizontally for natural selfie orientation
        if (facingMode === "user") {
          ctx.translate(w, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        return { dataUrl, width: w, height: h };
      },
    }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          onImageSelected?.(event.target?.result as string, img.width, img.height);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className="relative w-full h-full p-3 sm:p-4 flex items-center justify-center overflow-hidden select-none">
        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Hidden File Input for fallback */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Physical Viewfinder Housing Bezel */}
        <div className="relative w-full h-full max-w-sm rounded-2xl sm:rounded-3xl p-2 bg-gradient-to-b from-[#2B2724] via-[#1F1C1A] to-[#141210] shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(0,0,0,0.9),inset_0_-1px_1px_rgba(255,255,255,0.1)] border-2 border-[#3E3833] flex items-center justify-center overflow-hidden">
          {hasCamera ? (
            <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {/* Live Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-[filter] duration-300 ${
                  facingMode === "user" ? "-scale-x-100" : ""
                }`}
                style={{
                  filter: filmPreset.cssFilter,
                }}
              />

              {/* Optical Viewfinder Overlay (Corner Brackets, Crosshairs, Status) */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between items-center text-white/70 text-[9px] font-mono tracking-widest">
                  <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/20 backdrop-blur-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>REC</span>
                  </div>
                  <div className="bg-black/60 px-2 py-0.5 rounded border border-white/20 backdrop-blur-xs">
                    <span>{filmPreset.code}</span>
                  </div>
                </div>

                {/* Center Focus Reticle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 border border-white/20 rounded-2xl flex items-center justify-center">
                    {/* 4 Corner Optical Marks */}
                    <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400/90 rounded-tl-xs" />
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400/90 rounded-tr-xs" />
                    <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400/90 rounded-bl-xs" />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400/90 rounded-br-xs" />

                    {/* Center Focus Dot */}
                    <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-white/60 text-[9px] font-mono tracking-widest">
                  <span className="bg-black/60 px-2 py-0.5 rounded border border-white/20 uppercase">
                    {filmPreset.name}
                  </span>
                  <span className="bg-black/60 px-2 py-0.5 rounded border border-white/20">
                    INSTANT 1:1.22
                  </span>
                </div>
              </div>

              {/* Optical lens vignette & subtle glass curvature sheen */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 70px rgba(0, 0, 0, 0.6)",
                  background:
                    "radial-gradient(ellipse at 50% 45%, transparent 65%, rgba(15, 12, 10, 0.45) 100%)",
                }}
              />
            </div>
          ) : (
            /* Friendly Camera Fallback UI */
            <div className="flex flex-col items-center justify-center p-5 text-center max-w-xs">
              <div className="w-14 h-14 rounded-full bg-[#1C1A18] border border-[#E5983B]/50 flex items-center justify-center mb-3 text-[#FFA733] shadow-md">
                <Camera className="w-7 h-7" />
              </div>

              <h3 className="text-[#FAF7F0] text-sm font-bold tracking-tight mb-1">
                Camera Viewfinder Off
              </h3>

              <p className="text-[#A69C89] text-xs leading-relaxed mb-4">
                {cameraError ||
                  "Please allow camera access in browser settings to shoot instant photos."}
              </p>

              <div className="flex flex-col w-full gap-2">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#E88E44] hover:bg-[#D97E34] text-stone-950 font-bold text-xs shadow-md transition-all btn-tactile"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry Camera
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#2B2724] hover:bg-[#38332F] text-[#FAF7F0] border border-[#5A5247] font-bold text-xs shadow-md transition-all btn-tactile"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Load Photo from Disk
                </button>
              </div>
            </div>
          )}

          {/* Loading Viewfinder State */}
          {isLoading && hasCamera && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75 z-10 backdrop-blur-xs">
              <div className="flex flex-col items-center gap-2">
                <div className="w-7 h-7 border-3 border-[#E5983B] border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] text-[#FFA733] font-mono tracking-widest font-bold">
                  APERTURE INITIALIZING...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

CameraView.displayName = "CameraView";
