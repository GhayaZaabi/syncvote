import { Router } from 'express';
import { PostsController } from '../controllers';
import { validateCreatePost } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';
import authorize from '../middlewares/authorize';

export class PostsRoute {
  private postsController: PostsController;

  constructor(postsController: PostsController) {
    this.postsController = postsController;
  }

  createRouter(): Router {
    const router = Router();

    router.post('/posts', authJwt.verifyToken, validateCreatePost, this.postsController.createPost.bind(this.postsController));
    router.get('/posts', this.postsController.getPosts.bind(this.postsController));
    router.post('/posts/:postId/comments', authJwt.verifyToken, this.postsController.addCommentToPost.bind(this.postsController));

    router.get('/categories', this.postsController.getCategories.bind(this.postsController));

    router.get('/posts/:id', this.postsController.getPostById.bind(this.postsController));

    router.put('/posts/:id', authJwt.verifyToken, this.postsController.updatePost.bind(this.postsController));




    return router;
  }
}
