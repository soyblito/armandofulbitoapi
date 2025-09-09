import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('send')
  @ApiOperation({ summary: 'Enviar un correo electrónico de prueba' })
  @ApiBody({
    description: 'Correo electrónico al que se enviará el mensaje',
    schema: {
      example: {
        email: 'test@example.com',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Correo enviado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al enviar el correo.',
  })
  async sendTestEmail(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    try {
      await this.emailService.sendEmail(
        email,
        'Hola!',
        'Este es un correo de prueba.',
      );
      return { message: 'Correo enviado exitosamente.' };
    } catch (error) {
      throw new Error(`Error al enviar el correo: ${error.message}`);
    }
  }
}