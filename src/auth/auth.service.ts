import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as randtoken from 'rand-token';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { AuthResponse, CreateAuthDto } from './dto/create-auth.dto';
import { UserRepository } from '../users/users.repository';
import { UtilityService } from '../utility/utility.service';
import { ConfigService } from '../config/config.service';
import { ProfileRepository } from '../profile/profile.repository';

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
    private readonly utilService: UtilityService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly profileRepository: ProfileRepository,
  ) {
    this.oAuth2Client = new OAuth2Client(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      this.configService.get('REDIRECT_URL'),
    );
  }

  async create(createAuthDto: CreateAuthDto): Promise<AuthResponse> {
    try {
      const user = await this.userRepository
        .findOne({
          email: createAuthDto.email,
          deleted: false,
        })
        ?.select('email password roles');

      if (!user) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: [
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
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: [
            {
              field: 'email',
              message: 'Invalid email or password',
            },
          ],
        });
      }

      const refreshToken = randtoken.uid(256);
      await this.userRepository.findOneAndUpdate(
        { _id: user.id },
        { refreshToken },
      );

      const payload = this.utilService.getTokenPayload(user);
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        statusCode: HttpStatus.OK,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      this.logger.error('auth.service.create', err);
      if (err.status !== 500) {
        return {
          statusCode: err.status,
          ...err.response,
        };
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
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
        message: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async getGoogleAuth(code: string): Promise<AuthResponse> {
    try {
      const res = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(res.tokens);
      const tokens = this.oAuth2Client.credentials;

      const response = await this.oAuth2Client.request<UserInfoType>({
        url: `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`,
      });

      const userInfo = response.data;
      let user = await this.userRepository.findOne({
        email: userInfo.email,
        deleted: false,
      });
      const refreshToken = randtoken.uid(256);
      const hashedPassword = await bcrypt.hash(randtoken.uid(16), 10);

      if (!user) {
        user = await this.userRepository.create({
          email: userInfo.email,
          password: hashedPassword,
          roles: ['Customer'],
          avator: userInfo.picture,
          refreshToken,
        });
        await this.profileRepository.create({
          user: user.id,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
        });
      } else {
        await this.userRepository.findOneAndUpdate(
          { _id: user.id },
          {
            refreshToken,
            email: userInfo.email,
            avator: userInfo.picture,
          },
        );
        await this.profileRepository.findOneAndUpdate(
          { user: user.id },
          {
            user: user.id,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
          },
          { upsert: true },
        );
      }

      const payload = this.utilService.getTokenPayload(user);
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        statusCode: HttpStatus.OK,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      this.logger.error('auth.service.getAuth', err);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}
