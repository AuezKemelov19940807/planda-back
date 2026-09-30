import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthType } from './type/auth.type.js';
import { CreateUserDto } from '../users/dto/create.user.dto.js';
import { GraphQLError } from 'graphql';
import * as crypto from 'node:crypto';
import { MailService } from '../mail/mail.service.js';
import { GoogleAuthService } from './google-auth.service.js';
@Injectable()
export class AuthService {
  saltOrRounds: number = 10;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async signUp(payload: CreateUserDto) {
    const user = await this.usersService.create(payload);
    return user;
  }

  async signIn(email: string, password: string): Promise<AuthType> {
    const user = await this.usersService.findOne(email);

    if (!user || !user.password) {
      throw new GraphQLError('Invalid email or password', {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.email };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      hasPassword: Boolean(user.password),
      access_token,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new NotFoundException(
        'If this email exists, a reset code has been sent',
      );
    }

    const code = crypto.randomInt(100000, 1000000).toString();

    const codeHash = await bcrypt.hash(code, 10);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.usersService.savePasswordResetCode(user.id, codeHash, expiresAt);

    await this.mailService.sendPasswordResetCode(user.email, code);

    return {
      message: 'If this email exists, a reset code has been sent',
    };
  }

  async verifyResetCode(email: string, code: string) {
    const user = await this.usersService.findOne(email);

    if (!user || !user.resetPasswordTokenHash || !user.resetPasswordExpiresAt) {
      throw new BadRequestException('Invalid or expired code');
    }

    if (user.resetPasswordExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired code');
    }

    const isValid = await bcrypt.compare(code, user.resetPasswordTokenHash);

    if (!isValid) {
      throw new BadRequestException('Invalid or expired code');
    }

    return true;
  }
  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.usersService.findOne(email);

    if (!user || !user.resetPasswordTokenHash || !user.resetPasswordExpiresAt) {
      throw new BadRequestException('Invalid or expired code');
    }

    if (user.resetPasswordExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired code');
    }

    const isValid = await bcrypt.compare(code, user.resetPasswordTokenHash);

    if (!isValid) {
      throw new BadRequestException('Invalid or expired code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.updatePassword(user.id, hashedPassword);

    return {
      message: 'Password successfully changed',
    };
  }

  async logOut() {
    return true;
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      hasPassword: Boolean(user.password),
    };
  }

  async googleSignIn(credential: string): Promise<AuthType> {
    const user = await this.googleAuthService.verifyCredential(credential);

    const payload = {
      sub: user.id,
      username: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      hasPassword: Boolean(user.password),
      access_token,
    };
  }
}
