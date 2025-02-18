import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

export const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: function (req: Request, res: Response) {
    return res.locals?.user?.id || req.ip;
  },
  handler: function (req, res, next) {
    res.status(429).json({
      message: `Too many requests, please try again after 15 minutes`,
    });
  },
});
