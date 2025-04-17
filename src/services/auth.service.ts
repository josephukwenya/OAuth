import { User, IUser } from '../models/user.model';
import { SocialUserDTO } from '../dtos/auth.dto';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export class AuthService {
  async socialLogin(
    profile: any,
    provider: 'google' | 'facebook' | 'github'
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const socialUser: SocialUserDTO = {
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
      provider,
      profileUrl: provider === 'github' ? profile.profileUrl : undefined,
    };

    // Dynamically assign the provider-specific ID
    const providerIdField = `${provider}Id` as keyof SocialUserDTO;
    (socialUser as any)[providerIdField] = profile.id;

    // Dynamically assign the provider-specific ID with proper typing
    // if (provider === 'google') {
    //   socialUser.googleId = profile.id;
    // } else if (provider === 'github') {
    //   socialUser.githubId = profile.id;
    // } else if (provider === 'facebook') {
    //   socialUser.facebookId = profile.id;
    // }

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
