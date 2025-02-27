import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organization } from "../../organization/entities/organization.entity";
import { User } from "../../user/entities/user.entity";
import { Task } from "../../task/entities/task.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne((type) => Organization, (org) => org.projects)
  organization: number;

  @ManyToOne(() => User, (user) => user.projects)
  createdBy: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
