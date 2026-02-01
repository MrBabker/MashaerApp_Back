import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CURRENT_USER_KEY, JWT_Payload } from 'src/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (token && type === 'Bearer') {
      try {
        const payload: JWT_Payload = await this.jwtService.verifyAsync(token, {
          secret: this.config.get<string>('SECURITY_KEY'),
        });
        request[CURRENT_USER_KEY] = payload;
      } catch {
        return false;
      }
    } else {
      throw new UnauthorizedException();
    }

    return true;
  }
}
