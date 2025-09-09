import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Query
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // --- LOGIN ---
  @Post('login')
  async login(@Body() loginDto: any, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);

    // Cookie httpOnly para WEB
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
    });

    return res.json({ accessToken });
  }

  // --- REFRESH (WEB via cookie, Mobile via body) ---
  @Post('refresh')
  async refresh(@Req() req: Request, @Body('refreshToken') bodyToken?: string) {
    const cookieToken = req.cookies?.refresh_token;
    const token = cookieToken || bodyToken; // Web usa cookie, Mobile manda en body
    return this.authService.refresh(token);
  }

  // --- LOGOUT ---
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refresh_token');
    return res.json({ message: 'Logged out' });
  }

  // -- REGISTER ---
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const user = await this.authService.register(dto);
    return res.json({ message: 'User registered', user });
  }

  // -- VERIFY ---
  @Post('verify')
  async verify(@Query('token') token: string, @Res() res: Response) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      // Busca el usuario y actualiza el estado
      await this.authService.verifyUser(payload.userId);
      return res.json({ message: 'Cuenta verificada' });
    } catch {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }
  }

  // -- FORGOT PASSWORD ---
  @Post('forgot')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.sendPasswordReset(email);
  }

  // -- RESET PASSWORD ---
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

}
