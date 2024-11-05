import { Request, Response } from 'express';
import { CommentsService } from '../services';
import { validationResult } from 'express-validator';


export class CommentsController {
    private commentsService: CommentsService;
  
    constructor(commentsService: CommentsService) {
      this.commentsService = commentsService;
    }

      async getComments(request: Request, response: Response): Promise<void> {
        try {
          console.log('Comments : ');
          console.log(request.query.category);
    
          const commentsResponse = await this.commentsService.getComments();
    
          response.status(commentsResponse.status).send({
            ...commentsResponse,
          });
        } catch (error) {
          response.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: error
          });
        }
      }
 
    
}