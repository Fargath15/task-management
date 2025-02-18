import { AuthController } from "./auth.controller";
import { BaseController } from "./base-controller.controller";
import { TaskController } from "./task.controller";

export class ControllerFactory {
  getControllers(): Array<BaseController> {
    return [new AuthController("/v1", "/auth"), new TaskController("/v1", "/tasks")];
  }
}
