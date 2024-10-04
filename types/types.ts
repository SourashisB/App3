import { integer } from 'aws-sdk/clients/cloudfront';
import {ReactNode} from 'react';

export interface PromptCardProps {
  title: string;
  image: any;
  posts: number;
  prompt: string;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
}

export interface RequestOptions extends RequestInit {
  method: string;
  headers: Headers;
  body: string | FormData;
}

export interface APIResponse {
  status: string;
  generationTime: number;
  id: number;
  output: string[];
  meta: Record<string, any>;
  eta: integer;
}

export interface ImageContextType {
  savedImages: string[];
  addImage: (url: string) => void;
  loadSavedImages: () => void;
}

export interface ImageProviderProps {
  children: ReactNode;
}