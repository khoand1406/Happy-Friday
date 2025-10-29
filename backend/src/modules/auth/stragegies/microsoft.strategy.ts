import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';

export class MicrosoftStragegy extends PassportStrategy(Strategy, 'microsoft') {
  constructor() {
    super({
      clientID: process.env.MICROSOFT_CLIENT_ID ?? '',
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? '',
      callbackURL: process.env.MICROSOFT_REDIRECT_URI,
      scope: ['user.read', 'email', 'openid', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      email: profile.emails[0].value,
      name: profile.displayName,
      id: profile.id,
    };
  }
}
