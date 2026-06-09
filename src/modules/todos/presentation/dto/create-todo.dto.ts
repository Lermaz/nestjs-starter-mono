import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Input DTO for creating a todo.
 */
export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly title!: string;

  @IsOptional()
  @IsBoolean()
  readonly isCompleted?: boolean;
}
