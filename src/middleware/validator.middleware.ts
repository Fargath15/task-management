import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

export class RequestValidator {
  public static Validate(schema: Schema, req: Request, res: Response, next: NextFunction) {
    let result = schema.validate(req.body);
    if (!result || result.error) {
      res.status(400).json({ message: result.error?.details ?? new Error("Invalid Request") });
      return;
    } else {
      next();
    }
  }
}
