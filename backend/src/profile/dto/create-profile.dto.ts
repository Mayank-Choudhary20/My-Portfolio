import {
  IsString,
  IsEmail,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  tagline: string;

  @IsString()
  about: string;

  @IsOptional()
  @IsString()
  mission?: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  location: string;

  @IsString()
  profileImage: string;

  @IsString()
  github: string;

  @IsString()
  linkedin: string;

  @IsOptional()
  @IsString()
  leetcode?: string;

  @IsOptional()
  @IsString()
  codechef?: string;

  @IsOptional()
  @IsString()
  codeforces?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsNumber()
  yearsExperience: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}