import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
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
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromHeader(request);
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

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      const user = await this.userRepository.findOne({
        _id: payload.id,
        deleted: false,
      });

      if (!user) {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: [{ field: '', message: 'Token is missing in the request' }],
        });
      }
      request['user'] = user;
      return true;
    } catch (err) {
      this.logger.error('AuthGuard.canActivate', err);
      if (err.name === 'TokenExpiredError') {
        const refreshToken = this.extractRefreshTokenFromHeader(request);
        if (!refreshToken) {
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: [
              { field: '', message: 'Token is missing in the request' },
            ],
          });
        }
        const user = await this.userRepository.findOne({
          refreshToken,
          deleted: false,
        });

        if (!user) {
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: [
              { field: '', message: 'Token is missing in the request' },
            ],
          });
        }
        const payload = this.commonService.getTokenPayload({
          id: user.id,
          roles: user.roles,
        });
        const accessToken = await this.jwtService.signAsync(payload);
        const rToken = randtoken.uid(256);
        user.refreshToken = rToken;
        await this.userRepository.findOneAndUpdate(
          { _id: user.id },
          { refreshToken: rToken },
        );

        request['user'] = user;
        response.set(
          'Access-Control-Expose-Headers',
          'x-access-token, x-refresh-token',
        );
        response.set('x-access-token', accessToken);
        response.set('x-refresh-token', rToken);
        return true;
      }
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: [{ field: '', message: 'Token is missing in the request' }],
      });
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractRefreshTokenFromHeader(request: Request): string | undefined {
    return request.headers['x-refresh-token'] as string;
  }
}
