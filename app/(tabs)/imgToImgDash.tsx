import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Alert, ActivityIndicator  } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import PromptCard from '../../components/PromptCard';
import { PromptCardProps, RequestOptions, APIResponse } from '../../types/types';
import {Dimensions } from 'react-native';
import AWS from 'aws-sdk';
import 'react-native-get-random-values';
import {useImages} from '../ImageContext';


const { height } = Dimensions.get('window');
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

// Configure AWS
AWS.config.update({
  accessKeyId: 'AKIAXQIP742O6UIW3NN2',
  secretAccessKey: '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',
  region: 'ap-southeast-2'
});
const s3 = new AWS.S3();


const prompts: PromptCardProps[] = [
  { title: 'Sunset Background', image: require('../../assets/img_1.jpeg'), posts: 120, prompt: "masterpiece,high resolution,winter-city,snow" },
  { title: 'Victorian 8-Bit', image: require('../../assets/img_2.jpeg'), posts: 233, prompt: "Change background to have a sunny day" },
  { title: 'Cartoonify', image: require('../../assets/img_3.jpeg'), posts: 89, prompt: "masterpiece,8-bit,pixel art,portrait,solo" },
  { title: 'Make me a painting', image: require('../../assets/img_4.jpeg'), posts: 235, prompt: "art-deco,conceptual-art,painting,oil-painting" },
  { title: 'Randomized Magic Mix', image: require('../../assets/img_5.jpeg'), posts: 479, prompt: "Change background to medieval village" },
  { title: 'Cyberpunk', image: require('../../assets/img_6.jpeg'), posts: 150, prompt: "masterpiece,high resolution,futuristic-city,solo,bubble design,city backround,night,neon,<lora:futuristic_city-xl:0.6>" },
];


const ImageToImageDash: React.FC = () => {
  const { addImage } = useImages();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null); 
  const [selectedPrompt, setSelectedPrompt] = useState<number | 0>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const handleImageSelection = async (useCamera: boolean) => {
    let result;
    if (useCamera) {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission Denied", "Camera access is required to take a photo.");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled && result.assets.length > 0) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  const uploadToS3 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Generate a timestamp
    const timestamp = Date.now().toString();
    
    // Remove the first 4 digits and add "photo" at the beginning
    const modifiedTimestamp = 'photo' + timestamp.slice(4);
    
    const key = `uploads/${modifiedTimestamp}.jpg`;
  
    const params = {
      Bucket: 'modelslab-test-sour',
      Key: key,
      Body: blob,
      ContentType: 'image/jpeg',
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
        if (err) {
          console.error(err);
          reject('Error uploading image');
        } else {
          // Construct the public URL manually
          const publicUrl = String(`https://${params.Bucket}.s3.${AWS.config.region}.amazonaws.com/${params.Key}`);
          resolve(publicUrl);
          console.log(publicUrl);
        }
      });
    });
  };

  const handleImageUpload = async (imageUri: string) => {
    try {
      setIsLoading(true);
      setLoadingText('AI has the image...');
      const publicUrl = await uploadToS3(imageUri);
      console.log('Image uploaded successfully. Public URL:', publicUrl);
      const editedImageURL = await imageToImageAPI(publicUrl);
      console.log(editedImageURL);

      setLoadingText('Saving image...');
      await addImage(editedImageURL);

      // Navigate to gallery with the new image URL and a timestamp
      router.push({ 
        pathname: '/tabs/gallery',
        params: { 
          newImageUrl: editedImageURL,
          timestamp: Date.now()
        }
      });
      // You can now use this URL as needed, e.g., save it to your app's state or database  
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingText('');
    }
  };

  const imageToImageAPI = async(imageUri: string) => {
    var raw = JSON.stringify({
      "key": "89qz2rpqbf30b5",
      "prompt": String(prompts[selectedPrompt].prompt),
      "negative_prompt": "bad quality",
      "init_image": String(imageUri),
      "samples": "1",
      "temp": false,
      "safety_checker": false,
      "strength":0.5,
      "seed": null,
      "webhook": null,
      "track_id": null
    });
    var requestOptions: RequestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try {
      const response = await fetch("https://modelslab.com/api/v1/enterprise/realtime/img2img", requestOptions);
      const result: APIResponse = await response.json();
      console.log(result);
      console.log(result.status);
      if (result.eta) {
        const etaSeconds = parseInt(String(result.eta), 10);
        await new Promise(resolve => setTimeout(resolve, etaSeconds * 1000));
      }
      console.log(result.output[0].replace(/([^:]\/)\/+/g, "$1"));
      return result.output[0].replace(/([^:]\/)\/+/g, "$1");
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const handlePromptSelect = (index: number) => {
    setSelectedPrompt(index);
    Alert.alert(
      "Choose an option",
      "",
      [
        {
          text: "Take Photo",
          onPress: () => handleImageSelection(true)
        },
        {
          text: "Upload Photo",
          onPress: () => handleImageSelection(false)
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

// in app/dashboard.tsx

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Prompts</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {prompts.map((prompt, index) => (
            <TouchableOpacity key={index} onPress={() => handlePromptSelect(index)}>
              <PromptCard {...prompt} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      )}
      </View>
    </SafeAreaView>
  );
  };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: height * 0.01, // Add 1% top padding
    paddingBottom: height * 0.01, // Add 1% bottom padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: height * 0.03, // Increased from 20 to 3% of screen height
    marginBottom: height * 0.03,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#0300e6',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: height * 0.02,
  },
});

export default ImageToImageDash;