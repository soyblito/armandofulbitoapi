import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from '../email/email.service'; // importa el servicio
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService
  ) { }

  private readonly jwtSecret = process.env.JWT_SECRET || 'secret';
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'refreshSecret';

  async login({ email, password }) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== 'active') throw new UnauthorizedException('Cuenta no verificada');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.signAccessToken(user);
    const refreshToken = this.signRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    try {
      const payload = jwt.verify(token, this.jwtRefreshSecret) as any;
      return { accessToken: this.signAccessToken(payload) };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private signAccessToken(user: any) {
    return jwt.sign({ sub: user._id, email: user.email }, this.jwtSecret, {
      expiresIn: '15m',
    });
  }

  private signRefreshToken(user: any) {
    return jwt.sign({ sub: user._id, email: user.email }, this.jwtRefreshSecret, {
      expiresIn: '30d',
    });
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = new this.userModel({
      name: dto.name,
      lastname: dto.lastname, // <-- asegúrate de incluir esto
      telephone: dto.telephone,
      email: dto.email,
      password: hashed,
      status: 'pending',
    });

    const savedUser = await user.save();

    // Genera un token de verificación (puedes usar JWT o un UUID)
    const verificationToken = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    // Envía el email de verificación
    await this.emailService.sendEmailConfirmation(
      savedUser.email,
      savedUser.name,
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?token=${verificationToken}`
    );

    return savedUser;
  }

  async verifyUser(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { status: 'active' });
  }

  async sendPasswordReset(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    // Genera un token de recuperación (puedes usar JWT o UUID)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Envía el email con el enlace de recuperación
    await this.emailService.sendPasswordResetEmail(user.email, token);
    return { message: 'Email enviado' };
  }

  async resetPassword(token: string, password: string) {
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch {
      throw new BadRequestException('Token inválido o expirado');
    }
    const user = await this.userModel.findById(payload.userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return { message: 'Contraseña cambiada con éxito' };
  }


}
