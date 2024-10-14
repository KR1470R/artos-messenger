import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ExceptionResponseDto } from '#common/dto';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/requests';
import { SignInResponseDto } from './dto/responses';
import { Public } from '#common/decorators';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    description: 'Log in and get JWT token which expires in 1 day.',
  })
  @ApiOkResponse({
    description: 'Signed in successfully.',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token.',
    type: ExceptionResponseDto,
  })
  public async signIn(
    @Body() data: SignInRequestDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<SignInResponseDto> {
    const { token, refreshToken } = await this.authService.processSignIn(
      data.username,
      data.password,
    );
    try {
      res.setCookie('jid', refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return { token };
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    description:
      'Refresh JWT token by previous generated token which stored in cookies and which expires in 30 days.',
  })
  @ApiOkResponse({
    description: 'Token refreshed successfully.',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token.',
    type: ExceptionResponseDto,
  })
  public async refreshToken(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<SignInResponseDto> {
    const previousToken = req.cookies.jid;
    if (!previousToken) throw new UnauthorizedException('Invalid token');
    try {
      const { token, refreshToken } =
        await this.authService.processRefreshToken(previousToken);
      res.setCookie('jid', refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return { token };
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
