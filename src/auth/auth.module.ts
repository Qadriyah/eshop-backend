import 'dotenv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ProfileModule } from '../profile/profile.module';
import { CommonService } from '@app/common';
import { VisitorModule } from './visitor/visitor.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CommonService],
  imports: [
    UsersModule,
    ProfileModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET as string,
      signOptions: { expiresIn: process.env.JWT_TTL as string },
    }),
    VisitorModule,
  ],
})
export class AuthModule {}
