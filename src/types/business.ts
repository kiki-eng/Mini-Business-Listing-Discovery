export type BusinessOwner = 'me' | 'other';

export type Business = {
  id: string;
  name: string;
  category: string;
  description: string;
  location?: string;
  owner: BusinessOwner;
  createdAt: string;
  isVerified?: boolean;
  views?: number;
  saves?: number;
  isFeatured?: boolean;
  isFavorite?: boolean;
};

export type BusinessFormData = {
  name: string;
  category: string;
  description: string;
};
