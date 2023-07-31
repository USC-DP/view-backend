import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountModule } from '../account/account.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [AccountModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: {expiresIn: '300s'}
  })],
  controllers: [AuthController],
  providers: [AuthService,
  //enable global route protection
    {
      provide: APP_GUARD,
      useClass: AuthGuard
  }],
})
export class AuthModule {}
