import { Post } from '../types/entities/Post';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Timestamp } from 'firebase/firestore';
import { categories } from '../constants/categories';
import { formatUserData } from '../utils/formatData';

export class PostsService {
  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async createPost(postData: Post): Promise<IResBody> {
    const postRef = this.db.posts.doc();
    await postRef.set({
      ...postData,
      voteCount: 0,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 201,
      message: 'Post created successfully!',
    };
  }

  async getPosts(): Promise<IResBody> {
    const posts: Post[] = [];
    const postsQuerySnapshot = await this.db.posts.get();

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts
    };
  }

  async getCategories(): Promise<IResBody> {
    return {
      status: 200,
      message: 'Categories retrieved successfully!',
      data: categories
    };
  }

  async addCommentToPost(commentData: any, postId: string): Promise<IResBody> {
    // logic to add comment
    return {
      status: 200,
      message: 'Comment added successfully!',
      data: categories
    };
  }

  async getPostById(postId: string): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();

    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found',
      };
    }

    const postData = {
      id: postDoc.id,
      ...postDoc.data(),
      createdAt: (postDoc.data()?.createdAt as Timestamp)?.toDate(),
      updatedAt: (postDoc.data()?.updatedAt as Timestamp)?.toDate(),
  };

    return {
      status: 200,
      message: 'Post retrieved successfully !',
      data: 
        postData
      
    };
  }

  async updatePost(postId: string, updateData: Partial<Post>, userId: string, userRole: string): Promise<IResBody> {
    const postRef = this.db.posts.doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found',
      };
    }

    const postData = postDoc.data();

    if (postData?.createdBy !== userId && userRole !== 'admin') {
      return {
        status: 403,
        message: 'Forbidden! You do not have permission to update this post.',
      };
    }

    await postRef.update({
      ...updateData,
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 200,
      message: 'Post updated successfully!',
      data: {
        id: postId,
        ...updateData,
      },
    };
  }
}
