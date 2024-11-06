import { Request, Response } from 'express';
import { CommentsService } from '../services';
import { validationResult } from 'express-validator';


export class CommentsController {
  private commentsService: CommentsService;

  constructor(commentsService: CommentsService) {
    this.commentsService = commentsService;
  }

  async addCommentToPost(request: Request, response: Response): Promise<void> {
    try {
      const { description } = request.body;

      const commentData = {
        description,
        postId: request.params.postId,
        createdBy: request.userId,
      };

      const commentResponse = await this.commentsService.addCommentToPost(commentData);

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
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

  async getallCommentsPost(request: Request, response: Response): Promise<void> {
    const { postId } = request.params;

    try {
      const commentResponse = await this.commentsService.getAllCommentsPost(postId);

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async getCommentById(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const commentResponse = await this.commentsService.getCommentById(request.params.id);

        response.status(commentResponse.status).send({
          ...commentResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'Comment not found'
        });
      }
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      })
    }
  }

  async updateComment(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request. Validation errors.',
        data: errors.array(),
      });
      return;
    }

    try {
      const commentId = request.params.id;
      const updateData = request.body;
      const userId = request.userId as string;
      const userRole = request.userRole as string;

      if (!userId || !userRole) {
        response.status(400).json({
          status: 400,
          message: 'User ID and role are required.',
        });
        return;
      }

      const commentResponse = await this.commentsService.updateComment(commentId, updateData, userId, userRole);

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  async deleteComment(request: Request, response: Response): Promise<void> {
    try {
      const commentId = request.params.id;
      const userId = request.userId as string;
      const userRole = request.userRole as string;

      if (!userId || !userRole) {
        response.status(400).json({
          status: 400,
          message: 'User ID and role are required.',
        });
        return;
      }

      const commentResponse = await this.commentsService.deleteComment(commentId, userId, userRole);

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

}