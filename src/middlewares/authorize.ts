import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
interface DecodeToken extends JwtPayload {
  id: string;
  role: string;
}
const authorize = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = 'admin';
    if (userRole !== requiredRole) {
        console.log('User role from request:', req.userRole);
      return res.status(403).json({
        status: 403,
        message: 'Forbidden ! You have to be admin to perform',
      });
    }
    next();
  };
};
export default authorize;