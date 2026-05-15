import { IsString, IsDateString, IsNotEmpty, Matches } from 'class-validator';

export class CreateTravelPlanDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsNotEmpty()
  @Matches(/^[A-Z]{3}$/)
  destinationAlphaCode!: string;
}
