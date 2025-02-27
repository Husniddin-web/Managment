import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task, TaskStatus } from "./entities/task.entity";
import { Repository } from "typeorm";
import { Request } from "express";
import { Project } from "../project/entities/project.entity";
import { OrganizationUser } from "../organization/entities/organization-user.entity";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(OrganizationUser)
    private readonly orgUserRepo: Repository<OrganizationUser>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>
  ) {}
  async create(createTaskDto: CreateTaskDto, req: any) {
    const { project, workerUser } = createTaskDto;
    const pro = await this.projectRepo.findOne({
      where: { id: project },
      relations: ["organization"],
    });

    const isBelongOrg = await this.orgUserRepo.findOne({
      where: {
        user: { id: workerUser },
        organization: { id: pro?.organization["id"] },
      },
    });

    if (!isBelongOrg) {
      throw new BadRequestException("This user not belong to this project");
    }
    const task = this.taskRepo.create({
      ...createTaskDto,
      createdBy: req.user.id,
    });

    return await this.taskRepo.save(task);
  }

  findAll() {
    return this.taskRepo.find({
      relations: ["createdBy", "project", "workerUser"],
    });
  }

  async startTask(id: number, req: any) {
    const task = await this.findOne(id);

    if (task.workerUser["id"] !== req.user.id) {
      throw new ForbiddenException();
    }
    if (!task) {
      throw new NotFoundException("Task not found");
    }

    if (task.status !== TaskStatus.CREATED) {
      throw new BadRequestException("Task has already started or is completed");
    }

    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      throw new BadRequestException("Cannot start task: Due date has expired");
    }

    task.status = TaskStatus.IN_PROCESS;

    return await this.taskRepo.save(task);
  }

  async endTask(id: number, req: any) {
    const task = await this.findOne(id);
    if (task.workerUser["id"] !== req.user.id) {
      console.log("das");
      throw new ForbiddenException();
    }
    if (!task) {
      throw new NotFoundException("Task not found");
    }

    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      throw new BadRequestException(
        "Cannot complete task: Due date has expired"
      );
    }

    if (task.status === TaskStatus.DONE || task.status === TaskStatus.CREATED) {
      throw new BadRequestException("Task is already completed");
    }

    task.status = TaskStatus.DONE;
    task.doneAt = new Date();

    return await this.taskRepo.save(task);
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ["createdBy", "project", "workerUser"],
    });

    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }
  // update task
  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);

    Object.assign(task, updateTaskDto);
    return await this.taskRepo.save(task);
  }

  // remove task
  async remove(id: number) {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);
    return {
      message: "Succesfully delted",
    };
  }
  // get user task
  async getMyTask(req: Request) {
    const user_id = req["user"].id;
    const tasks = await this.taskRepo.find({
      where: { workerUser: user_id },
      relations: ["createdBy", "project"],
    });

    return tasks;
  }
}
