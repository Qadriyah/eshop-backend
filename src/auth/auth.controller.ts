import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  AuthResponse,
  CreateAuthDto,
  CreateVisitorAuthDto,
} from './dto/create-auth.dto';
import {
  AuthPipe,
  ResetPasswordByLinkPipe,
  ResetPasswordRequestPipe,
  VisitorAuthPipe,
} from './auth.pipe';
import { whitelistOrigins } from '../main';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from '../profile/profile.service';
import { CustomersService } from '../customers/customers.service';
import {
  ResetPasswordByLinkDto,
  ResetPasswordRequestDto,
} from './dto/reset-password.dto';
import { EmailsService } from 'src/emails/emails.service';
import { CurrentUser } from './current.user.decorator';
import { UserDocument } from 'src/users/entities/user.entity';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly customerService: CustomersService,
    private readonly profileService: ProfileService,
    private readonly emailService: EmailsService,
  ) {}

  @Post('login')
  async create(
    @Body(AuthPipe) createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const { accessToken, refreshToken, sessionToken } =
      await this.authService.create(createAuthDto);
    response
      .cookie('authentication', accessToken, {
        httpOnly: true,
      })
      .cookie('rtoken', refreshToken, {
        httpOnly: true,
      })
      .cookie('_session-token', sessionToken);

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Post('guest')
  async loginGuest(
    @Body(VisitorAuthPipe) creadteAuthDto: CreateVisitorAuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const { accessToken, userId } = await this.authService.createGuestAuth(
      creadteAuthDto,
    );
    const profile = await this.profileService.findOne(String(userId));
    if (!profile) {
      await this.profileService.create({
        user: userId,
      });
    }
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_TTL'),
    );
    response.cookie('authentication', accessToken, {
      httpOnly: true,
      expires,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Post('google-auth-url')
  async getAuthUrl(
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    response.header('Access-Control-Allow-Origin', whitelistOrigins);
    response.header('Referrer-Policy', 'no-referrer-when-downgrade');
    const authUrl = await this.authService.getGoogleAuthourizedUrl();
    return {
      statusCode: HttpStatus.OK,
      authUrl,
    };
  }

  @Get('google-auth')
  async getAuth(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const { code } = request.query;
    const { accessToken, refreshToken, sessionToken, userId, userInfo } =
      await this.authService.getGoogleAuth(code as string);

    const customer = await this.customerService.createCustomer({
      name: `${userInfo.family_name} ${userInfo.given_name}`,
      email: userInfo.email,
    });

    const profile = await this.profileService.findOne(String(userId));
    if (!profile) {
      await this.profileService.create({
        user: userId,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        customer: customer.id,
      });
    } else {
      await this.profileService.update(String(userId), {
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        customer: customer.id,
      });
    }
    response
      .cookie('authentication', accessToken, {
        httpOnly: true,
      })
      .cookie('rtoken', refreshToken, {
        httpOnly: true,
      })
      .cookie('_session-token', sessionToken);
    response.redirect(this.configService.get('REDIRECT_FRONTEND_URL'));

    return {
      statusCode: HttpStatus.OK,
    };
  }

  @Post('logout')
  async logoutUser(
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    response
      .cookie('authentication', '', { expires: new Date(0) })
      .cookie('rtoken', '', { expires: new Date(0) })
      .cookie('_session-token', '', { expires: new Date(0) });

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
    };
  }

  @Post('reset-password-request')
  async resetPasswordRequest(
    @Body(ResetPasswordRequestPipe) data: ResetPasswordRequestDto,
  ) {
    const accessToken = await this.authService.resetPasswordRequest(data.email);

    await this.emailService.create({
      from: this.configService.get('EMAIL_SENDER'),
      to: data.email,
      fromName: 'Notifications',
      subject: 'Reset Password',
      template: 'password_reset',
      body: {
        link: `${this.configService.get(
          'REDIRECT_DASHBOARD_URL',
        )}/forgot-password/create-new-password?token=${accessToken}`,
        email: data.email,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      accessToken,
    };
  }

  @UseGuards(AuthGuard)
  @Post('reset-password-request/link')
  async resetPasswordByLink(
    @Body(ResetPasswordByLinkPipe) data: ResetPasswordByLinkDto,
    @CurrentUser() user: UserDocument,
  ) {
    await this.authService.resetPasswordByLink(user.id, data.password);

    return {
      statusCode: HttpStatus.OK,
      message: 'Password has been reset successfully',
    };
  }
}
