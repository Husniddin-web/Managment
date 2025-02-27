import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Roles } from "../decorators/role-auth.decorator";
import { UserRole } from "../user/entities/user.entity";
import { JwtAuthGuard } from "../guards/JwtAuthGuard.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Request } from "express";

@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles(UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
    return this.projectService.create(createProjectDto, req);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Roles(UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectService.findOne(+id);
  }

  @Roles(UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Roles(UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectService.remove(+id);
  }

  @Roles(UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("organization/:id")
  getOrganizationProjects(@Param("id") id: string) {
    return this.projectService.getOrganizationProjects(+id);
  }
}
