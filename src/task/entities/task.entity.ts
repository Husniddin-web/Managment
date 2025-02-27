import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Project } from "../../project/entities/project.entity";

export enum TaskStatus {
  CREATED = "CREATED",
  IN_PROCESS = "IN_PROCESS",
  DONE = "DONE",
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tasks)
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  project: number;

  @Column({ type: "date", nullable: true })
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
  workerUser: number;

  @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.CREATED })
  status: TaskStatus;

  @Column({ type: "timestamp", nullable: true })
  doneAt: Date;
}
