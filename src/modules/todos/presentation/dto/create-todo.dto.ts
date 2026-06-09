import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * Input DTO for creating a todo.
 */
export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly title!: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  readonly isCompleted?: boolean;
}
