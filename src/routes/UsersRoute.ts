import { Router } from 'express';
import { UserController } from '../controllers';
import { validateCreateUser, validateLoginUser, validateUpdateUser } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';
import authorize from '../middlewares/authorize';

export class UsersRoute {
  private userController: UserController;

  constructor(userController: UserController) {
    this.userController = userController;
  }

  createRouter(): Router {
    const router = Router();

    router.post('/users', validateCreateUser, this.userController.createUser.bind(this.userController));
    router.get('/users', authJwt.verifyToken, this.userController.getUsers.bind(this.userController));

    router.get('/users/:id', authJwt.verifyToken, this.userController.getUserById.bind(this.userController));

    router.post('/auth/login', validateLoginUser, this.userController.login.bind(this.userController));

    router.put('/users/:id', validateUpdateUser, authorize('admin'), this.userController.updateUser.bind(this.userController));

    // router.put('/users/me',authJwt.verifyToken, this.userController.updateConnectedUser.bind(this.userController)); // cette route ne fonctionne pas
    router.put('/connecteduser', authJwt.verifyToken, this.userController.updateConnectedUser.bind(this.userController));


    return router;
  }
}
