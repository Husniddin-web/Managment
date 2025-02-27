import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Project } from "../project/entities/project.entity";
import { Task } from "./entities/task.entity";
import { Organization } from "../organization/entities/organization.entity";
import { OrganizationUser } from "../organization/entities/organization-user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Project,
      Task,
      Organization,
      OrganizationUser,
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
