export type Role = "ADMIN" | "EDITOR" | "ARTIST";


export interface User {
  id: string;
  name?: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  genre: string;
  mood: string;
  imageUrl?: string;
  trackUrl?: string;      
  authorId: string;
  createdAt: Date;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface News {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  projectId: string;
  createdAt: Date;
}

export interface ItunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  primaryGenreName: string;
  collectionName: string;
}