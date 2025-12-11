import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IAccessTokenPayload } from '../interface/token-payload';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IAccessTokenPayload) {
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return {
      id: user._id.toHexString(),
      name: user.name,
      email: user.email,
    };
  }
}
