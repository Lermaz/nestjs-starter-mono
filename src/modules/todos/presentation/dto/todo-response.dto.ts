/**
 * Output shape for todo API responses.
 */
export class TodoResponseDto {
  readonly id!: string;
  readonly title!: string;
  readonly isCompleted!: boolean;
  readonly createdAt!: Date;
}
