import { User } from '../../models/Users';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      tokenPayload?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}