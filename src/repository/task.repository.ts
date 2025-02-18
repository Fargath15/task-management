import { ITask, ITaskFilter, Task } from "../models/task.model";

export class TaskRepository {
  async createTask(data: ITask, createdBy: string): Promise<ITask> {
    const task = new Task({ ...data, createdBy: createdBy });
    await task.save();
    await task?.populate("assignedTo");
    return task;
  }

  async updateTask(task_id: string, data: ITask, updatedBy: string): Promise<ITask | undefined> {
    const task = await Task.findById(task_id);
    if (!task) {
      return undefined;
    } else {
      if (data.title) {
        task.title = data.title;
      }
      if (data.description) {
        task.description = data.description;
      }
      if (data.status) {
        task.status = data.status;
      }
      if (data.dueDate) {
        task.dueDate = data.dueDate;
      }
      if (data.assignedTo) {
        task.assignedTo = data.assignedTo;
      }
      if (data.updatedBy) {
        task.updatedBy = data.updatedBy;
      }
      await task.save();
      await task?.populate("assignedTo");
      return task as ITask;
    }
  }

  async getTaskById(task_id: string): Promise<ITask> {
    const task = await Task.findById(task_id)?.populate("assignedTo")?.populate("createdBy")?.populate("updatedBy");
    return task as ITask;
  }

  async deleteTaskById(task_id: string): Promise<ITask> {
    const task = await Task.findByIdAndDelete(task_id)?.populate("assignedTo")?.populate("createdBy")?.populate("updatedBy");
    return task as ITask;
  }

  async searchTask(filter: ITaskFilter): Promise<ITask[]> {
    let page_number: number = filter?.pagination?.page_number ? filter.pagination.page_number : 0;
    let items_per_page: number = filter?.pagination?.items_per_page ? filter.pagination.items_per_page : 0;

    const skip = (page_number - 1) * items_per_page;
    const limit = items_per_page;

    const tasks = await Task.find({ title: "" }).skip(skip).limit(limit);
    return tasks as ITask[];
  }
}
