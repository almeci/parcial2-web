import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  category!: string;
}
