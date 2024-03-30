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
    const token = this.extractTokenFromHeader(context, 'authentication');
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return await this.setAuthUser(payload.id, context);
    } catch (err) {
      this.logger.error('AuthGuard.canActivate', err);
      if (err.name === 'TokenExpiredError') {
        const refreshToken = this.extractTokenFromHeader(context, 'rtoken');
        return await this.refreshToken(refreshToken, context);
      }
      const response = context.switchToHttp().getResponse();
      response
        .cookie('authentication', '', { expires: new Date(0) })
        .cookie('rtoken', '', { expires: new Date(0) })
        .cookie('_session-token', '', { expires: new Date(0) });

      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errors: [
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
    name: string,
  ): string | undefined {
    const token = context.switchToHttp().getRequest().cookies?.[name];
    if (!token) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errors: [
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
      response
        .cookie('authentication', '', { expires: new Date(0) })
        .cookie('rtoken', '', { expires: new Date(0) })
        .cookie('_session-token', '', { expires: new Date(0) });

      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errors: [
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
    response
      .cookie('authentication', accessToken, {
        httpOnly: true,
      })
      .cookie('rtoken', rToken, {
        httpOnly: true,
      })
      .cookie('_session-token', user.id);

    return true;
  }

  private async setAuthUser(
    userId: string,
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const user = await this.userRepository
      .findOne({
        _id: userId,
        deleted: false,
      })
      .populate(['profile']);

    if (!user) {
      response
        .cookie('authentication', '', { expires: new Date(0) })
        .cookie('rtoken', '', { expires: new Date(0) })
        .cookie('_session-token', '', { expires: new Date(0) });

      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errors: [
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
