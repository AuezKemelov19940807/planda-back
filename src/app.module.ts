import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersService } from './users/users.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { FilesModule } from './files/files.module.js';
import { MailModule } from './mail/mail.module.js';
import { FinanceService } from './finance/finance.service.js';

import { FinanceModule } from './finance/finance.module.js';
import { FinanceSpaceService } from './finance-space/finance-space.service.js';
import { FinanceSpaceResolver } from './finance-space/finance-space.resolver.js';
import { FinanceSpaceModule } from './finance-space/finance-space.module.js';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
      introspection: true,

      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    MailModule,
    FinanceModule,
    FinanceSpaceModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, FinanceService, FinanceSpaceService, FinanceSpaceResolver],
})
export class AppModule {}
