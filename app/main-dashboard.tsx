// MainDashboard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const MainDashboard: React.FC = () => {
  const router = useRouter();

  const navigateTo = (route: string) => {
    switch(route) {
      case 'imgToImgDash':
        router.push({
          pathname: '/(tabs)/imgToImgDash',
        });
        break;
      case 'textToImage':
        
      case 'imageUpscale':
      case 'textToVideo':
      case 'settings':
      case 'profile':
      case 'messages':
        // For now, these will just show an alert
        alert(`Navigating to ${route} - This feature is not implemented yet.`);
        break;
      default:
        console.warn(`Unknown route: ${route}`);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridItem} onPress={() => navigateTo('textToImage')}>
            <Text style={styles.gridItemText}>Text to Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => navigateTo('imgToImgDash')}>
            <Text style={styles.gridItemText}>Image to Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => navigateTo('/imageUpscale')}>
            <Text style={styles.gridItemText}>Image Upscale</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => navigateTo('/textToVideo')}>
            <Text style={styles.gridItemText}>Text to Video</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigateTo('/settings')}>
          <Text style={styles.footerItemText}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigateTo('/profile')}>
          <Text style={styles.footerItemText}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigateTo('/messages')}>
          <Text style={styles.footerItemText}>✉️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  gridItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerItem: {
    padding: 10,
  },
  footerItemText: {
    fontSize: 24,
  },
});

export default MainDashboard;