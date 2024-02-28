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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async create(
    @Body(AuthPipe) createAuthDto: CreateAuthDto,
    @Res() response: Response,
  ): Promise<AuthResponse> {
    const { user, accessToken, refreshToken } = await this.authService.create(
      createAuthDto,
      response,
    );
    response.cookie('authentication', accessToken, {
      httpOnly: true,
    });
    response.cookie('rtoken', refreshToken, {
      httpOnly: true,
    });
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Success',
      user,
    });
  }

  @Post('guest')
  async loginGuest(
    @Body(VisitorAuthPipe) creadteAuthDto: CreateVisitorAuthDto,
    @Res() response: Response,
  ): Promise<AuthResponse> {
    const { user, profile, accessToken } =
      await this.authService.createGuestAuth(creadteAuthDto);
    response.cookie('authentication', accessToken, {
      httpOnly: true,
    });
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Success',
      user,
      profile,
    });
  }

  @Post('google-auth-url')
  async getAuthUrl(@Res() response: Response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Referrer-Policy', 'no-referrer-when-downgrade');
    const authUrl = await this.authService.getGoogleAuthourizedUrl();
    return response.status(HttpStatus.OK).json({
      url: authUrl,
    });
  }

  @Get('google-auth')
  async getAuth(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<AuthResponse> {
    const { code } = request.query;
    const { user, accessToken, refreshToken } =
      await this.authService.getGoogleAuth(code as string, response);
    response.cookie('authentication', accessToken, {
      httpOnly: true,
    });
    response.cookie('rtoken', refreshToken, {
      httpOnly: true,
    });
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Success',
      user,
    });
  }
}
