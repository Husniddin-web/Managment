import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "./entities/organization.entity";
import { Repository } from "typeorm";
import { OrganizationUser } from "./entities/organization-user.entity";
import { User } from "../user/entities/user.entity";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(OrganizationUser)
    private readonly organizationUserRepo: Repository<OrganizationUser>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}
  async create(createOrganizationDto: CreateOrganizationDto, req: any) {
    console.log(req.user);
    const isExit = await this.orgRepo.findOne({
      where: { name: createOrganizationDto.name },
    });
    if (isExit) {
      throw new BadRequestException("Bunday nomli tashkilot mavjud");
    }
    const org = this.orgRepo.create({
      ...createOrganizationDto,
      createdBy: req.user.id,
    });
    return await this.orgRepo.save(org);
  }

  findAll() {
    return this.orgRepo.find({
      relations: ["createdBy", "projects", "projects.tasks"],
    });
  }

  async findOne(id: number) {
    const org = await this.orgRepo.findOne({
      where: { id },
      relations: ["createdBy", "projects"],
    });

    if (!org) {
      throw new NotFoundException(`Tashkilot mavjud emas`);
    }

    return org;
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    await this.findOne(id);

    await this.orgRepo.update(id, updateOrganizationDto);

    return await this.findOne(id);
  }

  async remove(id: number) {
    const org = await this.findOne(id);
    await this.orgRepo.remove(org);
    return { message: "Succesfully deleted" };
  }

  async addUserToOrg(userId: number, orgId: number) {
    const organization = await this.findOne(orgId);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const orgUser = this.organizationUserRepo.create({
      user: user,
      organization: organization,
    });

    return this.organizationUserRepo.save(orgUser);
  }

  async getAllUserOrganization(orgId: number) {
    console.log(orgId);
    const organization = await this.findOne(orgId);
    const orgUsers = await this.organizationUserRepo.find({
      where: {
        organization: { id: organization.id },
      },
      relations: ["user"],
    });

    return orgUsers.map((orgUser) => orgUser.user);
  }

  async removeUserOrganization(userId: number, orgId: number) {
    const orgUser = await this.organizationUserRepo.findOne({
      where: { organization: { id: orgId }, user: { id: userId } },
    });
    console.log(orgUser);
    if (!orgUser) {
      throw new NotFoundException(
        `User with ID "${userId}" not found in organization with ID "${orgId}"`
      );
    }

    await this.organizationUserRepo.remove(orgUser);

    return { message: "Succesfully deleted" };
  }

  async getOrganizationStats() {
    const organizations = await this.orgRepo.find({
      relations: ["projects", "projects.tasks"],
    });

    return organizations.map((org) => ({
      organizationName: org.name,
      totalProjects: org.projects.length,
      totalTasks: org.projects.reduce(
        (acc, project) => acc + project.tasks.length,
        0
      ),
    }));
  }

 

  async getOverallStats() {
    const organizations = await this.orgRepo.find({
      relations: ["projects", "projects.tasks"],
    });

    const totalOrganizations = organizations.length;
    const totalProjects = organizations.reduce(
      (acc, org) => acc + org.projects.length,
      0
    );
    const totalTasks = organizations.reduce(
      (acc, org) =>
        acc +
        org.projects.reduce((acc2, project) => acc2 + project.tasks.length, 0),
      0
    );

    return {
      totalOrganizations,
      totalProjects,
      totalTasks,
    };
  }
}
