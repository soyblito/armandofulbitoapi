import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService], // IMPORTANTE: Debe exportar EmailService
})
export class EmailModule { }