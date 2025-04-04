export interface SocialUserDTO {
  providerId: string;
  email?: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'facebook';
  googleId?: string;
}
