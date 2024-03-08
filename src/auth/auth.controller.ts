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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async create(
    @Body(AuthPipe) createAuthDto: CreateAuthDto,
    @Res() response: Response,
  ): Promise<AuthResponse> {
    const { accessToken, refreshToken } = await this.authService.create(
      createAuthDto,
    );
    response.cookie('authentication', accessToken, {
      httpOnly: true,
    });
    response.cookie('rtoken', refreshToken, {
      httpOnly: true,
    });
    response.cookie('islogin', 'true');
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Success',
    });
  }

  @Post('guest')
  async loginGuest(
    @Body(VisitorAuthPipe) creadteAuthDto: CreateVisitorAuthDto,
    @Res() response: Response,
  ): Promise<AuthResponse> {
    const { accessToken } = await this.authService.createGuestAuth(
      creadteAuthDto,
    );
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_TTL_SEC'),
    );
    response.cookie('authentication', accessToken, {
      httpOnly: true,
      expires,
    });
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Success',
    });
  }

  @Post('google-auth-url') // when you click the google button, we shall call this end point.
  async getAuthUrl(@Res() response: Response): Promise<AuthResponse> {
    response.header('Access-Control-Allow-Origin', whitelistOrigins);
    response.header('Referrer-Policy', 'no-referrer-when-downgrade');
    const authUrl = await this.authService.getGoogleAuthourizedUrl();
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      authUrl,
    });
  }

  @Get('google-auth')
  async getAuth(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { code } = request.query;
    const { accessToken, refreshToken } = await this.authService.getGoogleAuth(
      code as string,
    );
    response.cookie('authentication', accessToken, {
      httpOnly: true,
    });
    response.cookie('rtoken', refreshToken, {
      httpOnly: true,
    });
    response.cookie('islogin', 'true');
    response.redirect('http://localhost:3000');
  }

  @Post('logout')
  logoutUser(@Res() response: Response) {
    response.cookie('authentication', '', { expires: new Date(0) });
    response.cookie('rtoken', '', { expires: new Date(0) });
    response.cookie('islogin', 'false', { expires: new Date(0) });
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
    });
  }
}
