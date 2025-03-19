import { User, IUser } from '../models/user.model';
import { SocialUserDTO } from '../dtos/auth.dto';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export class AuthService {
  async socialLogin(
    profile: any,
    provider: 'google' | 'facebook'
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const socialUser: SocialUserDTO = {
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
      provider,
    };

    let user = await User.findOne({ providerId: socialUser.providerId });

    if (!user) {
      user = await User.create(socialUser);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }

  async findUserById(id: string) {
    return User.findById(id);
  }
}
