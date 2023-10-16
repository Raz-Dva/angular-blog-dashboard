import firebase from 'firebase/compat';

export interface DataPostForm {
  title: string;
  permalink: string;
  category: {
    category: string;
    id: string;
  };
  postImgURL: string;
  postImgPath: string;
  excerpt: string;
  content: string;
  isFeatured: boolean;
  views: number;
  status: string;
  createdAt: firebase.firestore.Timestamp;
}

export interface Post {
  data: DataPostForm;
  id: string;
}

export interface PostDataUpdate {
  title?: string;
  permalink?: string;
  category?: {
    category: string;
    id: string;
  };
  excerpt?: string;
  content?: string;
  postImgPath?: string;
}
