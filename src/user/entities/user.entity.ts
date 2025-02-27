import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organization } from "../../organization/entities/organization.entity";
import { Project } from "../../project/entities/project.entity";
import { Task } from "../../task/entities/task.entity";

export enum UserRole {
  ADMIN = "admin",
  ORG_MANAGER = "org_manager",
  ORG_WORKER = "org_worker",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.ORG_WORKER,
  })
  role: UserRole;

  @OneToMany(() => Organization, (org) => org.createdBy)
  org: Organization[];

  @OneToMany(() => Project, (org) => org.createdBy)
  projects: Project[];

  @OneToMany(() => Task, (task) => task.createdBy)
  tasks: Task[];

  @OneToMany(() => Task, (task) => task.workerUser)
  assignedTasks: Task[];
}
