import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { AuthService } from '../application/auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * HTTP controller for authentication operations.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user account.
   */
  @Public()
  @Post('register')
  register(@Body() input: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(input.email, input.password);
  }

  /**
   * Authenticates a user and returns a JWT access token.
   */
  @Public()
  @Post('login')
  login(@Body() input: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(input.email, input.password);
  }
}
