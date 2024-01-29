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
import { AuthResponse, CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async create(@Body() createAuthDto: CreateAuthDto): Promise<AuthResponse> {
    return await this.authService.create(createAuthDto);
  }

  @Post('google-auth-url')
  async getAuthUrl(@Res() response: Response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Referrer-Policy', 'no-referrer-when-downgrade');
    const authUrl = await this.authService.getGoogleAuthourizedUrl();
    return response.status(HttpStatus.OK).json({ url: authUrl });
  }

  @Get('google-auth')
  async getAuth(@Req() request: Request): Promise<AuthResponse> {
    const { code } = request.query;
    return await this.authService.getGoogleAuth(code as string);
  }
}
