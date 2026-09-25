import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { jwtConstants } from './constants.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver.js';
import { MailModule } from '../mail/mail.module.js';
import { GqlAuthGuard } from './gql-auth.guard.js';

@Module({
  imports: [
    UsersModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, AuthResolver, GoogleAuthService, GqlAuthGuard],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
