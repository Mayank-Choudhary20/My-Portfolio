import {
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  company: string;

  @IsString()
  role: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsBoolean()
  current: boolean;
}