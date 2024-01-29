import 'dotenv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UtilityModule } from '../utility/utility.module';
import { ConfigModule } from '../config/config.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    UtilityModule,
    ProfileModule,
    ConfigModule.register({ folder: './config' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET as string,
      signOptions: { expiresIn: process.env.JWT_TTL as string },
    }),
  ],
})
export class AuthModule {}
