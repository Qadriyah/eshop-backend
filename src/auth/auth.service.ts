import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as randtoken from 'rand-token';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { CreateAuthDto, CreateVisitorAuthDto } from './dto/create-auth.dto';
import { UserRepository } from '../users/users.repository';
import { ConfigService } from '@nestjs/config';
import {
  CommonService,
  CreateGuestAuth,
  CreateNormalAuth,
  GetGoogleAuth,
} from '@app/common';
import { UserDocument } from '../users/entities/user.entity';
import { USER_TYPES } from '@app/common/constants';

type UserInfoType = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private oAuth2Client: OAuth2Client;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.oAuth2Client = new OAuth2Client(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      this.configService.get('REDIRECT_URL'),
    );
  }

  async create(createAuthDto: CreateAuthDto): Promise<CreateNormalAuth> {
    try {
      let user = await this.userRepository
        .findOne({
          email: createAuthDto.email,
          $or: [{ roles: USER_TYPES.customer }, { roles: USER_TYPES.admin }],
          deleted: false,
          suspended: false,
        })
        ?.select('email password roles');

      if (!user) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          errors: [
            {
              field: 'email',
              message: 'User does not exist',
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(
        createAuthDto.password,
        String(user.password),
      );

      if (!isMatch) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          errors: [
            {
              field: 'email',
              message: 'Invalid email or password',
            },
          ],
        });
      }

      const refreshToken = randtoken.uid(25);
      user = await this.userRepository.findOneAndUpdate(
        { _id: user._id },
        { refreshToken },
      );

      const payload = this.commonService.getTokenPayload({
        id: user._id,
        email: user.email,
        roles: user.roles,
      });
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        accessToken,
        refreshToken: user.refreshToken,
        sessionToken: user.id,
      };
    } catch (err) {
      this.logger.error('auth.service.create', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async getGoogleAuthourizedUrl(): Promise<string> {
    try {
      const authUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope:
          'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
        prompt: 'consent',
      });
      return authUrl;
    } catch (err) {
      this.logger.error('auth.service.getAuthorizedUrl', err);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.BAD_REQUEST,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async getGoogleAuth(code: string): Promise<GetGoogleAuth> {
    try {
      const res = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(res.tokens);
      const tokens = this.oAuth2Client.credentials;

      const oAuthResponse = await this.oAuth2Client.request<UserInfoType>({
        url: `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`,
      });

      const userInfo = oAuthResponse.data;
      let user = await this.userRepository.findOne({
        email: userInfo.email,
        deleted: false,
        suspended: false,
      });
      const refreshToken = randtoken.uid(256);
      const hashedPassword = await bcrypt.hash(randtoken.uid(16), 10);

      if (!user) {
        user = await this.userRepository.create({
          email: userInfo.email,
          password: hashedPassword,
          roles: [USER_TYPES.customer],
          avator: userInfo.picture,
          refreshToken,
        } as UserDocument);
      } else {
        const roles = user.roles.includes(USER_TYPES.admin)
          ? user.roles
          : [USER_TYPES.customer];
        user = await this.userRepository.findOneAndUpdate(
          { _id: user.id },
          {
            refreshToken,
            roles,
            email: userInfo.email,
            avator: userInfo.picture,
          },
        );
      }

      const payload = this.commonService.getTokenPayload({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        userId: user.id,
        accessToken,
        refreshToken: user.refreshToken,
        userInfo,
        sessionToken: user.id,
      };
    } catch (err) {
      this.logger.error('auth.service.getAuth', err);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async createGuestAuth(
    createGuestDto: CreateVisitorAuthDto,
  ): Promise<CreateGuestAuth> {
    try {
      const hashedPassword = await bcrypt.hash(randtoken.uid(16), 10);
      let user = await this.userRepository.findOne({
        email: createGuestDto.email,
      });
      if (!user) {
        user = await this.userRepository.create({
          email: createGuestDto.email,
          password: hashedPassword,
          roles: [USER_TYPES.guest],
        } as UserDocument);
      }

      const payload = this.commonService.getTokenPayload({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        accessToken,
        userId: user.id,
      };
    } catch (err) {
      this.logger.error('auth.service.loginVisitor', err);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}
