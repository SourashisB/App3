// app/image-view.tsx

import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useImages } from './ImageContext'; // Adjust the import path as needed

const { width, height } = Dimensions.get('window');

const ImageViewScreen: React.FC = () => {
  const { url } = useLocalSearchParams<{ url: string }>();
  const { savedImages } = useImages();
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeImage = async () => {
      setIsLoading(true);
      setError(null);

      // Try to use the URL from params first
      if (url) {
        setDisplayUrl(decodeURIComponent(url));
      } 
      // If no URL provided or it fails, use the most recent image from the gallery
      else if (savedImages.length > 0) {
        setDisplayUrl(savedImages[savedImages.length - 1]);
      } else {
        setError('No image available');
      }
    };

    initializeImage();
  }, [url, savedImages]);

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError('Failed to load image. Please try again.');
    setIsLoading(false);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {displayUrl && (
        <Image 
          source={{ uri: displayUrl }} 
          style={styles.image} 
          resizeMode="contain"
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      )}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageViewScreen;