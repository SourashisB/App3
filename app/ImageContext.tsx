// ImageContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageProviderProps } from '@/types/types';

interface ImageContextType {
  savedImages: string[];
  addImage: (url: string) => Promise<void>;
  clearAllImages: () => Promise<void>;
  loadSavedImages: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [savedImages, setSavedImages] = useState<string[]>([]);

  useEffect(() => {
    loadSavedImages();
  }, []);

  const loadSavedImages = async () => {
    try {
      const savedImagesJson = await AsyncStorage.getItem('savedImages');
      if (savedImagesJson) {
        const images = JSON.parse(savedImagesJson);
        setSavedImages(images);
      }
    } catch (error) {
      console.error('Failed to load saved images:', error);
    }
  };

  const addImage = async (url: string) => {
    try {
      const newSavedImages = [url, ...savedImages];
      await AsyncStorage.setItem('savedImages', JSON.stringify(newSavedImages));
      setSavedImages(newSavedImages);
    } catch (error) {
      console.error('Failed to save image:', error);
    }
  };

  const clearAllImages = async () => {
    try {
      await AsyncStorage.removeItem('savedImages');
      setSavedImages([]);
    } catch (error) {
      console.error('Failed to clear images:', error);
    }
  };

  return (
    <ImageContext.Provider value={{ savedImages, addImage, clearAllImages, loadSavedImages }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImages = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};