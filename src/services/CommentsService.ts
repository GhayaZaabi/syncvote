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

}