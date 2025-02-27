import { Module } from "@nestjs/common";
import { OrganizationService } from "./organization.service";
import { OrganizationController } from "./organization.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./entities/organization.entity";
import { User } from "../user/entities/user.entity";
import { Project } from "../project/entities/project.entity";
import { UserModule } from "../user/user.module";
import { OrganizationUser } from "./entities/organization-user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, Project, OrganizationUser]) ,UserModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
