import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Organization } from "./organization.entity";
import { User } from "../../user/entities/user.entity";

@Entity("organization_users")
export class OrganizationUser {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  org_id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: "org_id" })
  organization: Organization;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
