import { Post } from '../types/entities/Post';
import { Comment } from '../types/entities/Comment';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Timestamp } from 'firebase/firestore';
import { categories } from '../constants/categories';


export class CommentsService {
    private db: FirestoreCollections;

    constructor(db: FirestoreCollections) {
        this.db = db;
    }

    async addCommentToPost(commentData: any): Promise<IResBody> {
        const commentRef = this.db.comments.doc();
        await commentRef.set({
            ...commentData,
            voteCount: 0,
            createdAt: firestoreTimestamp.now(),
            updatedAt: firestoreTimestamp.now(),
        });

        return {
            status: 201,
            message: 'Comment added successfully!',
        };
    }

    async getComments(): Promise<IResBody> {
        const comments: Comment[] = [];
        const postsQuerySnapshot = await this.db.comments.get();

        for (const doc of postsQuerySnapshot.docs) {
            comments.push({
                id: doc.id,
                ...doc.data(),
                createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
                updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
            });
        }

        return {
            status: 200,
            message: 'Comments retrieved successfully!',
            data: comments
        };
    }


    async getAllCommentsPost(postId: string): Promise<any> {
        const Comments: Comment[] = [];
        const postsQuerySnapshot = await this.db.comments.where('postId', '==', postId).get();

        if (postsQuerySnapshot.empty) {
            return {
                status: 404,
                message: 'No comments found for this post.',
                data: [],
            };
        }

        for (const doc of postsQuerySnapshot.docs) {
            Comments.push({
                id: doc.id,
                ...doc.data(),
                createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
                updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
            });
        }

        return {
            status: 200,
            message: 'Comments retrieved successfully!',
            data: Comments
        };
    }

    async getCommentById(commentId: string): Promise<IResBody> {
        const commentDoc = await this.db.comments.doc(commentId).get();

        if (!commentDoc.exists) {
            return {
                status: 404,
                message: 'Post not found!',
                data: null,
            };
        }

        const commentData = {
            id: commentDoc.id,
            ...commentDoc.data(),
            createdAt: (commentDoc.data()?.createdAt as Timestamp)?.toDate(),
            updatedAt: (commentDoc.data()?.updatedAt as Timestamp)?.toDate(),
        };

        return {
            status: 200,
            message: 'Comment retrieved successfully!',
            data: commentData
        };
    }

    async updateComment(commentId: string, updateData: Partial<Post>, userId: string, userRole: string): Promise<IResBody> {
        const commentRef = this.db.comments.doc(commentId);
        const commentDoc = await commentRef.get();
    
        if (!commentDoc.exists) {
          return {
            status: 404,
            message: 'Post not found',
          };
        }
    
        const commentData = commentDoc.data();
    
        if (commentData?.createdBy !== userId && userRole !== 'admin') {
          return {
            status: 403,
            message: 'Forbidden! You do not have permission to update this post.',
          };
        }
    
        await commentRef.update({
          ...updateData,
          updatedAt: firestoreTimestamp.now(),
        });
    
        return {
          status: 200,
          message: 'Post updated successfully!',
          data: {
            id: commentId,
            ...updateData,
          },
        };
      }
    
      async deleteComment(commentId: string, userId: string, userRole: string): Promise<IResBody> {
        const commentRef = this.db.comments.doc(commentId);
        const commentDoc = await commentRef.get();
    
        if (!commentDoc.exists) {
          return {
            status: 404,
            message: 'Post not found',
          };
        }
    
        const commentData = commentDoc.data();
    
        if (commentData?.createdBy !== userId && userRole !== 'admin') {
          return {
            status: 403,
            message: 'Forbidden! You do not have permission to delete this post.',
          };
        } else {
    
          await commentRef.delete();
    
          return {
            status: 200,
            message: 'Post deleted successfully!',
          };
        }
      }

      async updownvoteComment(commentsId: string, userId: string): Promise<IResBody> {
        const commentRef = this.db.comments.doc(commentsId);
        const commentDoc = await commentRef.get();
    
        if (!commentDoc.exists) {
          return {
            status: 404,
            message: 'comment not found!',
            data: null,
          };
        }
    
        const commentData = commentDoc.data() as Post;
    
        if (!commentData.usersVote) commentData.usersVote = [];
        if (commentData.voteCount === undefined) commentData.voteCount = 0;
    
        const userHasVoted = commentData.usersVote.includes(userId);
    
        if (userHasVoted) {
          commentData.usersVote = commentData.usersVote.filter(id => id !== userId);
          commentData.voteCount -= 1; 
        } else {
          commentData.usersVote.push(userId);
          commentData.voteCount += 1;
        }
    
        await commentRef.update({
          usersVote: commentData.usersVote,
          voteCount: commentData.voteCount,
          updatedAt: firestoreTimestamp.now(),
        });
    
        return {
          status: 200,
          message: 'Vote processed successfully!',
          data: {
            id: commentsId,
            title: commentData.title,
            description: commentData.description,
            categories: commentData.categories,
            createdBy: commentData.createdBy,
            createdAt: commentData.createdAt instanceof Timestamp ? commentData.createdAt.toDate() : commentData.createdAt,
            updatedAt: firestoreTimestamp.now(),
            voteCount: commentData.voteCount,
            usersVote: commentData.usersVote,
          },
        };
      }

      async getTopComments(postId: string): Promise<IResBody> {
        const comments: Comment[] = [];
        const commentsSnapshot = await this.db.comments.where('postId', '==', postId).get();
    
        if (commentsSnapshot.empty) {
            return {
                status: 404,
                message: 'No comments found for this post.',
                data: [],
            };
        }
    
        commentsSnapshot.forEach(doc => {
            comments.push({
                id: doc.id,
                ...doc.data(),
                createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
                updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
            });
        });
    
        comments.sort((a, b) => (b.voteCount ?? 0) - (a.voteCount ?? 0));
    
        return {
            status: 200,
            message: 'Comments sorted by vote count successfully !',
            data: comments,
        };
    }
}