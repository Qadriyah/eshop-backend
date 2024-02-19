import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as randtoken from 'rand-token';
import { CommonService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../users/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private commonService: CommonService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = this.extractTokenFromHeader(context);
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return await this.setAuthUser(payload.id, context);
    } catch (err) {
      this.logger.error('AuthGuard.canActivate', err);
      if (err.name === 'TokenExpiredError') {
        const refreshToken = this.extractRefreshTokenFromHeader(context);
        return await this.refreshToken(refreshToken, context);
      }
      const response = context.switchToHttp().getResponse();
      response.set('Access-Control-Expose-Headers', 'x-refresh-token');
      response.set('x-refresh-token', '');
      response.cookie('authentication', '', {
        httpOnly: true,
      });
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: [
          {
            field: '',
            message: 'Token is missing in the request',
          },
        ],
      });
    }
  }

  private extractTokenFromHeader(
    context: ExecutionContext,
  ): string | undefined {
    const token = context.switchToHttp().getRequest().cookies?.authentication;
    if (!token) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: [
          {
            field: '',
            message: 'Token is missing in the request',
          },
        ],
      });
    }
    return token;
  }

  private extractRefreshTokenFromHeader(
    context: ExecutionContext,
  ): string | undefined {
    const token = context.switchToHttp().getRequest().headers?.[
      'x-refresh-token'
    ];
    if (!token) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: [
          {
            field: '',
            message: 'Token is missing in the request',
          },
        ],
      });
    }
    return token;
  }

  private async refreshToken(
    token: string,
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const user = await this.userRepository.findOne({
      refreshToken: token,
      deleted: false,
    });

    if (!user) {
      response.set('Access-Control-Expose-Headers', 'x-refresh-token');
      response.set('x-refresh-token', '');
      response.cookie('authentication', '', {
        httpOnly: true,
      });
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: [
          {
            field: '',
            message: 'Token is missing in the request',
          },
        ],
      });
    }
    const payload = this.commonService.getTokenPayload({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
    const accessToken = await this.jwtService.signAsync(payload);
    const rToken = randtoken.uid(256);
    user.refreshToken = rToken;
    await this.userRepository.findOneAndUpdate(
      { _id: user.id },
      { refreshToken: rToken },
    );

    request.user = user;
    response.set('Access-Control-Expose-Headers', 'x-refresh-token');
    response.set('x-refresh-token', rToken);
    response.cookie('authentication', accessToken, {
      httpOnly: true,
    });
    return true;
  }

  private async setAuthUser(
    userId: string,
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const user = await this.userRepository.findOne({
      _id: userId,
      deleted: false,
    });

    if (!user) {
      response.set('Access-Control-Expose-Headers', 'x-refresh-token');
      response.set('x-refresh-token', '');
      response.cookie('authentication', '', {
        httpOnly: true,
      });
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: [
          {
            field: '',
            message: 'Token is missing in the request',
          },
        ],
      });
    }

    request.user = user;
    return true;
  }
}
