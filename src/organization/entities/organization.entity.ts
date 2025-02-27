import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Project } from "../../project/entities/project.entity";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.org)
  @Column()
  createdBy: number;

  @OneToMany((type) => Project, (project) => project.organization)
  projects: Project[];
}
