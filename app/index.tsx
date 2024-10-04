import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, ActivityIndicator, Dimensions, Easing } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Button from '../components/Button';

const { height, width } = Dimensions.get('window');

const BUTTONS_BOTTOM_POSITION = -height * 0.74; // 10% from the bottom of the screen
const BUTTON_WIDTH = width * 0.4; // 80% of screen width

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const { reset } = useLocalSearchParams<{ reset?: string }>();
  const flashAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reset === 'true') {
      resetHomeScreen();
    } else {
      startFlashAnimation();
    }
  }, [reset]);

  const resetHomeScreen = () => {
    setIsLoading(false);
    animation.setValue(0);
    flashAnimation.setValue(0);
    startFlashAnimation();
  };

  const startFlashAnimation = () => {
    Animated.sequence([
      Animated.timing(flashAnimation, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(flashAnimation, {
        toValue: 0,
        duration: 1200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleLogin = () => {
    // Start zoom and translate animation
    Animated.timing(animation, {
      toValue: 1,
      duration: 400,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // After zoom, show loading screen
    setTimeout(() => {
      setIsLoading(true);
      // After loading, navigate to dashboard
      setTimeout(() => {
        router.replace({
          pathname: '/main-dashboard',
        });
      }, 600);
    }, 600);
  };

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 10]
  });

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.15]
  });

  const flashOpacity = flashAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.animatedContainer, 
          { 
            transform: [
              { scale },
              { translateY }
            ] 
          }
        ]}
      >
        <Video
          source={require('../assets/background.mp4')}
          style={styles.backgroundVideo}
          shouldPlay
          isLooping
          isMuted
          resizeMode={ResizeMode.COVER}
        />
      </Animated.View>
      <Animated.View 
        style={[
          styles.flashOverlay, 
          { opacity: flashOpacity }
        ]} 
      />
      <View style={styles.overlay}>
        <Button 
          title="LOGIN" 
          onPress={handleLogin}
          style={styles.loginButton}
        />
        <Button 
          title="REGISTER" 
          onPress={() => {}} 
          style={styles.registerButton}
        />
      </View>
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
    backgroundColor: '#fff',
    padding: 20,
  },
  animatedContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
  overlay: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center'
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loginButton: {
    backgroundColor: 'blue',
    width: BUTTON_WIDTH,
    marginBottom: 10,
    bottom: BUTTONS_BOTTOM_POSITION,
    justifyContent: 'center'
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
    width: BUTTON_WIDTH,
    bottom: BUTTONS_BOTTOM_POSITION,
    justifyContent: 'center'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});

export default HomeScreen;