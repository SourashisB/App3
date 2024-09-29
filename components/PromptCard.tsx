import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { PromptCardProps } from '../types/types';

const PromptCard: React.FC<PromptCardProps> = ({ title, image, posts }) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.posts}>{posts} Posts</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 150,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  posts: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PromptCard;