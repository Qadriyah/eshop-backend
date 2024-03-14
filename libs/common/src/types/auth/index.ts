import { Schema } from 'mongoose';
export interface GetGoogleAuth {
  accessToken: string;
  refreshToken: string;
  userId: Schema.Types.ObjectId;
  userInfo: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
  };
}

export interface CreateGuestAuth {
  accessToken: string;
  userId: Schema.Types.ObjectId;
}

export interface CreateNormalAuth {
  accessToken: string;
  refreshToken: string;
}
