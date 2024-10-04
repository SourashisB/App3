// gallery.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  TouchableOpacity, 
  Modal, 
  SafeAreaView, 
  Alert, 
  RefreshControl,
  Image,
  ActivityIndicator
} from 'react-native';
import { useImages } from '../ImageContext';
import { useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

const GalleryScreen: React.FC = () => {
  const { savedImages, clearAllImages, loadSavedImages } = useImages();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { newImageUrl, timestamp } = useLocalSearchParams<{ newImageUrl: string, timestamp: string }>();
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (newImageUrl && timestamp) {
      startPolling(newImageUrl);
    } else {
      setDisplayImages(savedImages);
    }
  }, [savedImages, newImageUrl, timestamp]);

  const startPolling = useCallback((imageUrl: string) => {
    setIsPolling(true);
    let attempts = 0;
    const maxAttempts = 10;
    const pollInterval = 2000; // 2 seconds

    const pollImage = () => {
      fetch(imageUrl, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            setDisplayImages(prevImages => [imageUrl, ...prevImages.filter(img => img !== imageUrl)]);
            setIsPolling(false);
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(pollImage, pollInterval);
          } else {
            console.error('Image not available after maximum attempts');
            setIsPolling(false);
          }
        })
        .catch(error => {
          console.error('Error polling image:', error);
          if (attempts < maxAttempts) {
            attempts++;
            setTimeout(pollImage, pollInterval);
          } else {
            setIsPolling(false);
          }
        });
    };

    pollImage();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadSavedImages();
      if (newImageUrl) {
        startPolling(newImageUrl);
      }
    } catch (error) {
      console.error('Error refreshing gallery:', error);
      Alert.alert('Refresh Failed', 'Unable to refresh the gallery. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [loadSavedImages, newImageUrl, startPolling]);

  const ImageItem = ({ uri }: { uri: string }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
      <View style={styles.imageContainer}>
        {isLoading && <ActivityIndicator style={styles.loader} />}
        <Image 
          source={{ uri: `${uri}?${Date.now()}` }}
          style={[styles.thumbnail, hasError && styles.errorImage]}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            console.error('Image loading error for URL:', uri);
          }}
        />
        {hasError && <Text style={styles.errorText}>!</Text>}
      </View>
    );
  };
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => setSelectedImage(item)}>
      <ImageItem uri={item} />
    </TouchableOpacity>
  );

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Images",
      "Are you sure you want to delete all saved images? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "OK", 
          onPress: async () => {
            await clearAllImages();
            setDisplayImages([]);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Gallery</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.buttonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>
      {displayImages.length === 0 ? (
        <View style={styles.emptyGallery}>
          <Text style={styles.noImagesText}>No images in the gallery yet.</Text>
        </View>
      ) : (
        <FlatList
          data={displayImages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <Modal visible={!!selectedImage} transparent={true} onRequestClose={() => setSelectedImage(null)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  refreshButton: {
    backgroundColor: '#4CAF50', // Green color
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  clearButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyGallery: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesText: {
    fontSize: 16,
    textAlign: 'center',
  },
  imageContainer: {
    width: (width - 60) / 2,
    height: (width - 60) / 2,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  errorImage: {
    opacity: 0.3,
  },
  errorText: {
    position: 'absolute',
    fontSize: 24,
    color: 'red',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GalleryScreen;