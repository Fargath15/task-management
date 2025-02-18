import { BaseController } from "./base-controller.controller";
import express, { NextFunction } from "express";
import bcrypt from "bcryptjs";
import { IUser, User } from "../models/user.model";
import { AuthMiddleware, RoleType } from "../middleware/auth.middleware";
import { UserRepository } from "../repository/user.repository";
import { ApiError } from "../middleware/error.middleware";

export class AuthController extends BaseController {
  protected userRepository?: UserRepository;
  protected GetUserRepository(): UserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository();
    }
    return this.userRepository;
  }
  constructor(version: string, route_path: string) {
    super(version, route_path);
    this.DefineRoutes(this.router);
  }

  public DefineRoutes(router: express.Router) {
    router.post("/register", async (req: express.Request, res: express.Response, next: NextFunction) => await this.signUp(req, res, next));
    router.post("/login", async (req: express.Request, res: express.Response, next: NextFunction) => {
      console.log("POST /login");
      await this.login(req, res, next);
    });
    router.post("/users", AuthMiddleware.ValidateUser([RoleType.Admin]), async (req: express.Request, res: express.Response, next: NextFunction) => await this.getAllUsers(req, res, next));
  }

  public async signUp(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const signUpReq: IUser = req.body as IUser;

      const email = await this.GetUserRepository().getUserByEmail(signUpReq.email);
      if (email) {
        return next(new ApiError(409, "Email already exists"));
      }
      const user = await this.GetUserRepository().createUser(signUpReq);

      res.status(201).json({ message: "User registered successfully" });
    } catch (e: any) {
      return next(new ApiError(500, e?.message ?? "Registration failed"));
    }
  }

  public async login(req: express.Request, res: express.Response, next: NextFunction) {
    console.log("login");
    const { email, password } = req.body;
    const user = await this.GetUserRepository().getUserByEmail(email);

    if (!user) {
      return next(new ApiError(400, "Invalid user"));
    }

    if (user && !(await bcrypt.compare(password, user.password))) {
      return next(new ApiError(400, "Invalid credentials"));
    }

    const token = AuthMiddleware.CreateSesson(user._id, user.role);
    res.json({ token });
  }

  public async getAllUsers(req: express.Request, res: express.Response, next: NextFunction) {
    const users = await this.GetUserRepository().searchUser();
    res.json({ users: users });
  }
}
