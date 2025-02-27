import { Organization } from "./../../organization/entities/organization.entity";
import { IsNumber, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  name: string;
  @IsNumber()
  organization: number;
}
