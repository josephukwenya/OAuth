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
      googleId: provider === 'google' ? profile.id : undefined,
    };

    let user = await User.findOne({ providerId: socialUser.providerId });

    if (!user) {
      try {
        user = await User.create(socialUser);
      } catch (err) {
        throw err;
      }
    }

    try {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return { user, accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  }

  async findUserById(id: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
