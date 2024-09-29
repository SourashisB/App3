// app/(tabs)/gallery.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Modal, SafeAreaView, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useImages } from '../ImageContext';

const { width, height } = Dimensions.get('window');

const GalleryScreen: React.FC = () => {
  const { savedImages, clearAllImages } = useImages();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => setSelectedImage(item)}>
      <FastImage source={{ uri: item }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Images",
      "Are you sure you want to delete all saved images? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            clearAllImages();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Gallery</Text>
        <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {savedImages.length === 0 ? (
        <Text style={styles.noImagesText}>No images in the gallery yet.</Text>
      ) : (
        <FlatList
          data={savedImages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
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
            <FastImage
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode={FastImage.resizeMode.contain}
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noImagesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  thumbnail: {
    width: (width - 60) / 2, // Accounting for padding and gap
    height: (width - 60) / 2,
    margin: 5,
    borderRadius: 5,
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
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
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