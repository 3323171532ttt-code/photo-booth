import { get, set, del } from "idb-keyval";

export interface GalleryPhoto {
  id: string;
  timestamp: number;
  dataUrl: string;
  filmId: string;
  filmName: string;
}

const GALLERY_KEY = "retro_snap_photos_v1";

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  try {
    const list = await get<GalleryPhoto[]>(GALLERY_KEY);
    return list || [];
  } catch (err) {
    console.error("Failed to load gallery photos:", err);
    return [];
  }
}

export async function savePhotoToGallery(photo: GalleryPhoto): Promise<void> {
  try {
    const existing = await getGalleryPhotos();
    // Add newest photo to the front of the film roll
    const updated = [photo, ...existing];
    await set(GALLERY_KEY, updated);
  } catch (err) {
    console.error("Failed to save photo to gallery:", err);
  }
}

export async function deletePhotoFromGallery(photoId: string): Promise<GalleryPhoto[]> {
  try {
    const existing = await getGalleryPhotos();
    const updated = existing.filter((p) => p.id !== photoId);
    await set(GALLERY_KEY, updated);
    return updated;
  } catch (err) {
    console.error("Failed to delete photo from gallery:", err);
    return [];
  }
}

export async function clearAllGallery(): Promise<void> {
  try {
    await del(GALLERY_KEY);
  } catch (err) {
    console.error("Failed to clear gallery:", err);
  }
}
