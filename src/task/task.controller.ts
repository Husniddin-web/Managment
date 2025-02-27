import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UserRole } from "../user/entities/user.entity";
import { JwtAuthGuard } from "../guards/JwtAuthGuard.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/role-auth.decorator";
import { Request } from "express";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Roles(UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    return this.taskService.create(createTaskDto, req);
  }

  @Roles(UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Roles(UserRole.ORG_MANAGER, UserRole.ORG_WORKER)
  @UseGuards(JwtAuthGuard)
  @Get("own")
  getMyTask(@Req() req: any) {
    return this.taskService.getMyTask(req);
  }

  @Roles(UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.taskService.findOne(+id);
  }

  @Roles(UserRole.ORG_MANAGER, UserRole.ORG_WORKER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("start/:id")
  startTask(@Param("id") id: string, @Req() req: Request) {
    return this.taskService.startTask(+id, req);
  }

  @Roles(UserRole.ORG_MANAGER, UserRole.ORG_WORKER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("end/:id")
  endTask(@Param("id") id: string, @Req() req: Request) {
    return this.taskService.endTask(+id, req);
  }

  @Roles(UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Roles(UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.taskService.remove(+id);
  }
}
