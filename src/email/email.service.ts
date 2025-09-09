import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'email-smtp.us-east-2.amazonaws.com',
      port: 465, // Puerto TLS
      secure: true, // Usar conexión segura
      auth: {
        user: 'AKIAQQABDLAOERFWWP6Z', // Usuario SMTP
        pass: 'BDfUxBqvnTNNAnJs0nvi73T4BvW/lKhw46wr68cnSGmr', // Contraseña SMTP
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: '"Armando Fulbito" <no-reply@20segundosgame.com>',
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email enviado exitosamente a: ${to}`);
    } catch (error) {
      console.error('❌ Error al enviar el correo:', error.message);
      throw new Error(`Error al enviar el correo: ${error.message}`);
    }
  }

  // NUEVO: Template para confirmación de email
  async sendEmailConfirmation(
    to: string,
    name: string,
    confirmationLink: string,
  ): Promise<void> {
    const subject = '✅ Confirma tu cuenta en Armando Fulbito';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
        <!-- Header -->
        <div style="background: #0a7ea4; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⚽ Armando Fulbito</h1>
          <p style="color: #e3f2fd; margin: 5px 0 0 0;">Tu app para organizar partidos</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">¡Hola ${name}! 👋</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            ¡Gracias por registrarte en <strong>Armando Fulbito</strong>! 🎉
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Para completar tu registro y empezar a organizar partidos con tus amigos, 
            necesitas confirmar tu dirección de email haciendo clic en el botón de abajo:
          </p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" 
               style="background: #0a7ea4; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;
                      font-weight: bold; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ✅ Confirmar mi cuenta
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 20px;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            <a href="${confirmationLink}" style="color: #0a7ea4; word-break: break-all;">
              ${confirmationLink}
            </a>
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              ⚠️ <strong>Importante:</strong> Este enlace expira en 24 horas.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            ¿Tienes problemas? Responde a este email y te ayudaremos.
          </p>
          <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
            Armando Fulbito - La mejor app para organizar partidos de fútbol
          </p>
        </div>
      </div>
    `;

    await this.sendEmail(to, subject, html);
  }

  // NUEVO: Template para email ya confirmado
  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const subject = '🎉 ¡Bienvenido a Armando Fulbito!';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
        <!-- Header -->
        <div style="background: #28a745; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ¡Cuenta Activada!</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">¡Perfecto, ${name}! ✅</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Tu cuenta ha sido confirmada exitosamente. Ya puedes empezar a:
          </p>
          
          <ul style="color: #666; font-size: 16px; line-height: 1.8;">
            <li>⚽ Crear y organizar partidos</li>
            <li>👥 Invitar amigos a jugar</li>
            <li>📱 Recibir notificaciones de convocatorias</li>
            <li>💰 Gestionar pagos de canchas</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}" 
               style="background: #28a745; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;
                      font-weight: bold; font-size: 16px;">
              🚀 Abrir Armando Fulbito
            </a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            ¡Que tengas excelentes partidos! ⚽
          </p>
        </div>
      </div>
    `;

    await this.sendEmail(to, subject, html);
  }

  // NUEVO: Reenvío de confirmación
  async resendEmailConfirmation(
    to: string,
    name: string,
    confirmationLink: string,
  ): Promise<void> {
    const subject = '🔄 Reenvío: Confirma tu cuenta en Armando Fulbito';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
        <div style="background: #ff9800; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🔄 Reenvío de Confirmación</h1>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <h2 style="color: #333;">Hola ${name},</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Parece que aún no has confirmado tu cuenta. No te preocupes, 
            aquí tienes un nuevo enlace de confirmación:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" 
               style="background: #ff9800; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block;
                      font-weight: bold; font-size: 16px;">
              ✅ Confirmar ahora
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center;">
            Este enlace expira en 24 horas.
          </p>
        </div>
      </div>
    `;

    await this.sendEmail(to, subject, html);
  }


  async sendPasswordResetEmail(email: string, token: string) {
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    const subject = '🔒 Recuperá tu contraseña en Armando Fulbito';
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <div style="background: #0a7ea4; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Recuperá tu contraseña</h1>
      </div>
      <div style="padding: 30px 20px; background: white;">
        <p>Hacé click en el botón para crear una nueva contraseña:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background: #0a7ea4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
            Recuperar contraseña
          </a>
        </div>
        <p style="color: #999; font-size: 14px; text-align: center;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
          <a href="${url}" style="color: #0a7ea4; word-break: break-all;">${url}</a>
        </p>
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            ⚠️ <strong>Importante:</strong> Este enlace expira en 1 hora.
          </p>
        </div>
      </div>
    </div>
  `;
    await this.sendEmail(email, subject, html);
  }

}