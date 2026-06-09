import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Input DTO for user login.
 */
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}
