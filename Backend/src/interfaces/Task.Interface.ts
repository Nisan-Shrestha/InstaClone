import { UUID } from "crypto";

export interface ITask {
  taskId: UUID;
  userId: UUID;
  detail: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

export enum TaskStatus {
  pending,
  done,
}

export interface GetTaskQuery {
  page?: number;
  size?: number;
}
