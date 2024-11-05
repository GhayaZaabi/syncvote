import { Router } from 'express';
import { CommentsController } from '../controllers';
import { validateCreatePost } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';


export class CommentsRoute {
    private commentsController: CommentsController;

    constructor(commentsController: CommentsController) {
        this.commentsController = commentsController;
    }


    createRouter(): Router {
        const router = Router();

        router.get('/comments', this.commentsController.getComments.bind(this.commentsController))

   
        return router;

    }






}