import React from 'react';
import { Stack } from 'expo-router';
import { ImageProvider } from './ImageContext';

export default function AppLayout() {
  return (
    <ImageProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="main-dashboard"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </ImageProvider>
  );
}