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
import { OrganizationService } from "./organization.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { Roles } from "../decorators/role-auth.decorator";
import { User, UserRole } from "../user/entities/user.entity";
import { JwtAuthGuard } from "../guards/JwtAuthGuard.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Request } from "express";
import { AddUserToOrgDto } from "./dto/addUserToORg.dto";

@Controller("organization")
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Req() req: Request
  ) {
    return this.organizationService.create(createOrganizationDto, req);
  }

  @Roles(UserRole.ADMIN, UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post("add-user")
  addUserToOrg(@Body() addUserToOrgDto: AddUserToOrgDto) {
    return this.organizationService.addUserToOrg(
      addUserToOrgDto.user_id,
      addUserToOrgDto.org_id
    );
  }

  @Roles(UserRole.ADMIN, UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post("remove-user")
  removeUserOrganization(@Body() addUserToOrgDto: AddUserToOrgDto) {
    return this.organizationService.removeUserOrganization(
      addUserToOrgDto.user_id,
      addUserToOrgDto.org_id
    );
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("statistcs")
  getOrgStatistcs() {
    return this.organizationService.getOrganizationStats();
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("all-statstics")
  getAllStats() {
    return this.organizationService.getOverallStats();
  }

  @Roles(UserRole.ADMIN, UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("users-all")
  getUsersOrganization(@Body() orgDto: { id: number }) {
    return this.organizationService.getAllUserOrganization(orgDto.id);
  }

  @Roles(UserRole.ADMIN, UserRole.ORG_MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.organizationService.findOne(+id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.organizationService.remove(+id);
  }
}
