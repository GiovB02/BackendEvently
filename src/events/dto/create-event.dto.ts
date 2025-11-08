import { IsString, IsDateString, IsArray, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  location: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attendees?: string[];
}
