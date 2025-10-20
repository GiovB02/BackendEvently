import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { OrganizerController } from './organizer.controller';

@Module({
  providers: [OrganizerService],
  controllers: [OrganizerController]
})
export class OrganizerModule {}