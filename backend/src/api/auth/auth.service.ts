import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Password } from '#common/utils';
import { Users } from '#api/users/users.entity';
import { UsersRepositoryToken } from '#api/users/constants';
import IUsersRepository from '#api/users/interfaces/users.repository.interface';

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
  ) {
    this.JWT_SECRET = this.configService.getOrThrow('JWT_TOKEN_SECRET');
    this.JWT_REFRESH_SECRET = this.configService.getOrThrow(
      'JWT_REFRESH_TOKEN_SECRET',
    );
  }

  public async processSignIn(username: string, password: string) {
    const user = (
      await this.usersRepository.findMany(
        {
          username,
        },
        true,
      )
    )[0] as Users | undefined;
    if (!user) throw new Error('Invalid credentials');
    if (await Password.compare(user.password, password)) {
      const token = await this.jwtService.signAsync(
        { username: user.username, id: user.id },
        {
          secret: this.JWT_SECRET,
          expiresIn: this.JWT_TOKEN_EXPIRES_IN,
        },
      );
      const refreshToken = await this.jwtService.signAsync(
        { username: user.username, id: user.id },
        {
          secret: this.JWT_REFRESH_SECRET,
          expiresIn: this.JWR_REFRESH_TOKEN_EXPIRES_IN,
        },
      );
      return { token, refreshToken };
    } else {
      throw new Error('Invalid credentials');
    }
  }

  public async processRefreshToken(previousToken: string) {
    const { username, id } = (await this.jwtService.verifyAsync(previousToken, {
      secret: this.JWT_REFRESH_SECRET,
    })) as { username: string; id: number };
    const newToken = await this.jwtService.signAsync(
      { username, id },
      {
        secret: this.JWT_SECRET,
        expiresIn: this.JWT_TOKEN_EXPIRES_IN,
      },
    );
    const newRefreshToken = await this.jwtService.signAsync(
      { username, id },
      {
        secret: this.JWT_REFRESH_SECRET,
        expiresIn: this.JWR_REFRESH_TOKEN_EXPIRES_IN,
      },
    );
    return { token: newToken, refreshToken: newRefreshToken };
  }
}
