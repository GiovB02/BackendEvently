import { IsString } from 'class-validator';

export class SaveEventDto {
  @IsString()
  eventId: string;
}
