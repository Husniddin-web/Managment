import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Repository } from "typeorm";
import { Project } from "./entities/project.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>
  ) {}
  async create(createProjectDto: CreateProjectDto, req: any) {
    const project = this.projectRepo.create({
      ...createProjectDto,
      createdBy: req.user.id,
    });
    return await this.projectRepo.save(project);
  }

  findAll() {
    return this.projectRepo.find({
      relations: ["createdBy", "organization", "tasks"],
    });
  }

  async findOne(id: number) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ["createdBy", "organization", "tasks"],
    });

    if (!project) {
      throw new NotFoundException();
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);

    await this.projectRepo.update(id, updateProjectDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    await this.projectRepo.remove(project);
    return { message: "Succesfully deleted" };
  }

  async getOrganizationProjects(orgId: number) {
    const projects = await this.projectRepo.find({
      where: { organization: { id: orgId } as any },
      relations: ["organization"],
    });
    console.log("Org ID:", orgId);
    console.log("Projects:", projects);

    return projects;
  }
}
