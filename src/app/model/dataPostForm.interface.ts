import { Timestamp } from 'firebase/firestore';

export interface PostDataForm {
  title: string;
  permalink: string;
  category: {
    category: string;
    id: string;
  };
  postImgURL: string;
  excerpt: string;
  content: string;
  isFeatured: boolean;
  views: number;
  status: string;
  postImgPath: string;
  createdAt: Timestamp;
}

export interface Post {
  data: PostDataForm;
  id: string;
}

export interface PostDataUpdate {
  title: string;
  permalink: string;
  category: {
    category: string;
    id: string;
  };
  excerpt: string;
  content: string;
  file?: string;
  postImgURL?: string;
}
export interface PostFeaturedUpdate {
  isFeatured: boolean;
}
