import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 👇 Nuevo endpoint público
  @Get('public')
  getPublic() {
    return { message: 'Conexión exitosa con el backend' };
  }
}

