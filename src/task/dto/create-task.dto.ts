import { IsEnum, IsInt, IsOptional, IsDate } from "class-validator";
import { TaskStatus } from "../entities/task.entity";
import { Type } from "class-transformer";

export class CreateTaskDto {
  @IsInt()
  project: number;

  @IsOptional()
  @IsInt()
  workerUser?: number;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;
}
