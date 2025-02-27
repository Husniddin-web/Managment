import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Organization } from "../organization/entities/organization.entity";
import { Project } from "./entities/project.entity";
import { Task } from "../task/entities/task.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, Project, Task])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
