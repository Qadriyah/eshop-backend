import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  AuthResponse,
  CreateAuthDto,
  CreateVisitorAuthDto,
} from './dto/create-auth.dto';
import { AuthPipe, VisitorAuthPipe } from './auth.pipe';
import { whitelistOrigins } from '../main';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from '../profile/profile.service';
import { CustomersService } from '../customers/customers.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly customerService: CustomersService,
    private readonly profileService: ProfileService,
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
      expires.getSeconds() + this.configService.get('JWT_TTL_SEC'),
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
}
