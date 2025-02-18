import express, { NextFunction } from "express";
import { BaseController } from "./base-controller.controller";
import { AuthMiddleware, RoleType } from "../middleware/auth.middleware";
import { EmailService } from "../service/email.service";
import { ITask, TaskSchema } from "../models/task.model";
import { IUser } from "../models/user.model";
import { TaskRepository } from "../repository/task.repository";
import { Server } from "socket.io";
import { RequestValidator } from "../middleware/validator.middleware";
import { ApiError } from "../middleware/error.middleware";

export class TaskController extends BaseController {
  protected taskRepository?: TaskRepository;
  protected GetTaskRepository(): TaskRepository {
    if (!this.taskRepository) {
      this.taskRepository = new TaskRepository();
    }
    return this.taskRepository;
  }

  constructor(version: string, route_path: string) {
    super(version, route_path);
    this.DefineRoutes(this.router);
  }

  public DefineRoutes(router: express.Router) {
    router.post(
      "/add",
      AuthMiddleware.ValidateUser([RoleType.Manager, RoleType.Admin]),
      async (req: express.Request, res: express.Response, next: NextFunction) => RequestValidator.Validate(TaskSchema.GetAddTaskSchema(), req, res, next),
      async (req: express.Request, res: express.Response, next: NextFunction) => await this.createTask(req, res, next)
    );
    router.put("/:id", AuthMiddleware.ValidateUser([RoleType.Employee, RoleType.Manager, RoleType.Admin]), async (req: express.Request, res: express.Response, next: NextFunction) => await this.updateTask(req, res, next));
    router.delete("/:id", AuthMiddleware.ValidateUser([RoleType.Manager, RoleType.Admin]), async (req: express.Request, res: express.Response, next: NextFunction) => await this.deleteTask(req, res, next));
    router.get("/:id", AuthMiddleware.ValidateUser([RoleType.Employee, RoleType.Manager, RoleType.Admin]), async (req: express.Request, res: express.Response, next: NextFunction) => await this.getTask(req, res, next));
    router.get("/", AuthMiddleware.ValidateUser([RoleType.Manager, RoleType.Admin]), async (req: express.Request, res: express.Response, next: NextFunction) => await this.getAllTasks(req, res, next));
  }

  public async createTask(req: express.Request, res: express.Response, next: NextFunction) {
    const taskReq: ITask = req.body;

    const task = await this.GetTaskRepository().createTask(taskReq, res.locals?.user?.id);
    if (!task) {
      return next(new ApiError(500, "Task creation failed"));
    }

    const io: Server = req.app.get("socketio");
    io.emit("taskAssigned", task);

    const assignedTo = task.assignedTo as IUser;
    const email = new EmailService();
    await email.SendTaskAssignedEmail(assignedTo.email, "New Task Assigned", {
      name: assignedTo.name,
      title: task.title,
      description: task.description,
      due_date: task.dueDate,
    });

    res.status(201).json(task);
  }

  public async updateTask(req: express.Request, res: express.Response, next: NextFunction) {
    const taskReq: ITask = req.body;

    let tasks = await this.GetTaskRepository().getTaskById(req.params.id);
    if (!tasks) {
      return next(new ApiError(404, "Task not found"));
    } else if (tasks.assignedTo?.toString() !== res.locals.user?.id && tasks.createdBy?.toString() !== res.locals.user?.id) {
      return next(new ApiError(404, "Task can be updated by Assignee / Creator"));
    }
    const task = await this.GetTaskRepository().updateTask(tasks._id, taskReq, res.locals?.user?.id);
    if (!task) {
      return next(new ApiError(500, "Error while updating task"));
    }

    const io: Server = req.app.get("socketio");
    io.emit("taskUpdated", task);

    const assignedTo = task.assignedTo as IUser;
    const email = new EmailService();
    await email.SendTaskUpdatedEmail(assignedTo.email, "Task Status Updated", {
      name: assignedTo.name,
      title: task.title,
      status: task.status,
    });

    res.json(task);
  }

  public async deleteTask(req: express.Request, res: express.Response, next: NextFunction) {
    const task = await this.GetTaskRepository().deleteTaskById(req.params.id);
    if (!task) {
      return next(new ApiError(404, "Task not found"));
    }
    const io: Server = req.app.get("socketio");
    io.emit("taskDeleted", { taskId: req.params.id });

    const assignedTo = task.assignedTo as IUser;
    const email = new EmailService();
    await email.SendTaskDeletedEmail(assignedTo.email, "Task Deleted", {
      name: assignedTo.name,
      title: task.title,
      status: task.status,
    });

    res.json({ message: "Task deleted" });
  }

  public async getTask(req: express.Request, res: express.Response, next: NextFunction) {
    const task = await this.GetTaskRepository().getTaskById(req.params.id);
    if (!task) {
      return next(new ApiError(404, "Task not found"));
    }
    res.status(200).json({ task: task });
  }

  public async getAllTasks(req: express.Request, res: express.Response, next: NextFunction) {
    const tasks = await this.GetTaskRepository().searchTask(req.body.filter);
    res.status(200).json({ tasks: tasks });
  }
}
