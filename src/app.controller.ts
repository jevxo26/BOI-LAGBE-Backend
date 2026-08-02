import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/guards/strict-jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Root API health/welcome endpoint — intentionally public so clients can
  // verify the service is up without a JWT. All /admin/* and business routes
  // remain protected by the global StrictJwtAuthGuard.
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
