import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto, LoginDto } from '@sistema-tickets/shared-types';

/** Usuarios mock para demo — reemplazar con BD en producción. */
const DEMO_USERS = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    email: 'soporte@empresa.com',
    password: 'demo123',
  },
];

@Injectable()
export class LoginService {
  constructor(private readonly jwtService: JwtService) {}

  login(dto: LoginDto): AuthResponseDto {
    const user = DEMO_USERS.find(
      (u) => u.email === dto.email && u.password === dto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    const expiresIn = 3600;

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn }),
      tokenType: 'Bearer',
      expiresIn,
      userId: user.id,
      email: user.email,
    };
  }
}
