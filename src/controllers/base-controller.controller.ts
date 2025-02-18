import express from "express";

export class BaseController {
  private controllerName: string;
  private version: string;
  protected router: express.Router;

  constructor(version: string, controllerName: string) {
    this.router = express.Router();
    this.version = version;
    this.controllerName = controllerName;
  }

  public getRoutePath(): string {
    return "/api" + this.version.trim() + this.controllerName.trim();
  }

  public getRouter(): express.Router {
    return this.router;
  }
}
