import 'dotenv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ProfileModule } from '../profile/profile.module';
import { CommonService } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomersService } from '../customers/customers.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CommonService, CustomersService],
  imports: [
    UsersModule,
    ProfileModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_TTL'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
