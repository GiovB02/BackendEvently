import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  eventId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  invitedContacts?: string[];
}
