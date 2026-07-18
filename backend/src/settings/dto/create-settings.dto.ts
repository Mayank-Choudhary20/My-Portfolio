import {
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateSettingsDto {

  @IsString()
  portfolioName: string;


  @IsString()
  heroTitle: string;


  @IsString()
  heroSubtitle: string;


  @IsOptional()
  @IsString()
  githubUrl?: string;


  @IsOptional()
  @IsString()
  linkedinUrl?: string;


  @IsOptional()
  @IsString()
  twitterUrl?: string;


  @IsOptional()
  @IsString()
  instagramUrl?: string;


  @IsOptional()
  @IsString()
  youtubeUrl?: string;


  @IsOptional()
  @IsString()
  leetcodeUrl?: string;


  @IsOptional()
  @IsString()
  codechefUrl?: string;


  @IsOptional()
  @IsString()
  email?: string;


  @IsOptional()
  @IsString()
  phone?: string;


  @IsOptional()
  @IsString()
  location?: string;


  @IsOptional()
  @IsString()
  resumeUrl?: string;


  @IsOptional()
  @IsString()
  seoTitle?: string;


  @IsOptional()
  @IsString()
  seoDescription?: string;


  @IsOptional()
  @IsString()
  primaryColor?: string;

}