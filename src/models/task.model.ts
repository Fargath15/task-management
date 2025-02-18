import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./user.model";
import Joi from "joi";

export enum TaskStatus {
  Pending = "Pending",
  InProgress = "In Progress",
  Completed = "Completed",
}

export interface ITask extends Document<string> {
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: mongoose.Types.ObjectId | IUser;
  dueDate?: Date;
  createdBy: mongoose.Types.ObjectId | IUser;
  updatedBy: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: TaskStatus, default: TaskStatus.Pending },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);

export interface ITaskFilter {
  pagination: {
    items_per_page?: number;
    page_number?: number;
  };
}

export class TaskSchema {
  public static GetAddTaskSchema(): Joi.Schema {
    return Joi.object<ITask>({
      title: Joi.string().required(),
      description: Joi.string().required(),
      status: Joi.string(),
      assignedTo: Joi.string().required(),
      dueDate: Joi.string().isoDate().required(),
    });
  }
}
