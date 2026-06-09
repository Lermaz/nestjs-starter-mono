import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

const MIN_PASSWORD_LENGTH = 8;

/**
 * Input DTO for user registration.
 */
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  readonly password!: string;
}
