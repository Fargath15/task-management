import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export enum RoleType {
  Manager = "Manager",
  Admin = "Admin",
  Employee = "Employee",
}

export class AuthMiddleware {
  public static ValidateUser(roles: RoleType[] = []) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const token = req.headers.authorization as string;
      if (!token) {
        res.status(401).json({ message: "Access Denied" });
        return;
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        res.locals.user = decoded;

        if (roles.length && !roles.includes(decoded?.role)) {
          res.status(403).json({ message: "Unauthorized" });
          return;
        }

        next();
      } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
      }
    };
  }

  public static CreateSesson(_id: string, role: RoleType): string {
    const token = jwt.sign({ id: _id, role: role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    return token;
  }
}
