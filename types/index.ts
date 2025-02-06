export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profilePicture?: string;
}

export interface TimeCapsule {
  id: string;
  userId: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  mediaUrl: string;
  mediaType: "image" | "video" | "3d-model";
  createdAt: Date;
  unlockDate: Date;
  isPublic: boolean;
}

export interface AuthResponse {
  user: User | null;
  token: string | null;
  error?: string;
}
