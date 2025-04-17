export interface SocialUserDTO {
  providerId: string;
  email?: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'facebook' | 'github';
  googleId?: string;
  githubId?: string;
  facebookId?: string;
  profileUrl?: string;
}
