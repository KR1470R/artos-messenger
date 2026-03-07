import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Password } from '#common/utils';
import { UsersRepositoryToken } from '#api/users/constants';
import IUsersRepository from '#api/users/interfaces/users.repository.interface';
import { E2eeService } from '#api/e2ee/e2ee.service';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_REFRESH_SECRET: string;
  private readonly JWT_TOKEN_EXPIRES_IN = '5d';
  private readonly JWR_REFRESH_TOKEN_EXPIRES_IN = '30d';

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: IUsersRepository,
    private readonly e2eeService: E2eeService,
  ) {
    this.JWT_SECRET = this.configService.getOrThrow('JWT_TOKEN_SECRET');
    this.JWT_REFRESH_SECRET = this.configService.getOrThrow(
      'JWT_REFRESH_TOKEN_SECRET',
    );
  }

  public async processSignIn(username: string, password: string) {
    const user = (await this.usersRepository.findOne({ username }, true))!;

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!(await Password.compare(user.password, password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [token, refreshToken, hasE2EEKey] = await Promise.all([
      this.jwtService.signAsync(
        { username: user.username, id: user.id },
        { secret: this.JWT_SECRET, expiresIn: this.JWT_TOKEN_EXPIRES_IN },
      ),
      this.jwtService.signAsync(
        { username: user.username, id: user.id },
        {
          secret: this.JWT_REFRESH_SECRET,
          expiresIn: this.JWR_REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
      this.e2eeService.hasKeys(user.id),
    ]);

    return { token, refreshToken, hasE2EEKey };
  }

  public async processRefreshToken(previousToken: string) {
    const { username, id } = (await this.jwtService.verifyAsync(previousToken, {
      secret: this.JWT_REFRESH_SECRET,
    })) as { username: string; id: number };

    const [newToken, newRefreshToken, hasE2EEKey] = await Promise.all([
      this.jwtService.signAsync(
        { username, id },
        { secret: this.JWT_SECRET, expiresIn: this.JWT_TOKEN_EXPIRES_IN },
      ),
      this.jwtService.signAsync(
        { username, id },
        {
          secret: this.JWT_REFRESH_SECRET,
          expiresIn: this.JWR_REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
      this.e2eeService.hasKeys(id),
    ]);

    return { token: newToken, refreshToken: newRefreshToken, hasE2EEKey };
  }
}
