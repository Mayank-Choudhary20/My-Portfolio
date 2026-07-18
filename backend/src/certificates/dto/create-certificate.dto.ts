import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  title: string;

  @IsString()
  organization: string;

  @IsDateString()
  issueDate: string;

  @IsOptional()
  @IsUrl()
  credentialUrl?: string;

  @IsUrl()
  imageUrl: string;

  @IsBoolean()
  featured: boolean;
}