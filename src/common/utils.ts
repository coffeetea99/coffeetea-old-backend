import { Request, Response, NextFunction }  from 'express';

// wrapping function for async handlers
export function wrap(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return async function(req: Request, res: Response, next: NextFunction) {
    try {
      await fn(req, res, next);
    } catch(err) {
      next(err);
    }
  }
}
