import { IsOptional, IsString } from 'class-validator';

export class CreateVisitorDto {
  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  device?: string;

  @IsOptional()
  @IsString()
  browser?: string;

  @IsOptional()
  @IsString()
  os?: string;

  // ── NEW — sent from the Next.js API route ──────────────────────
  @IsOptional()
  @IsString()
  userAgent?: string;
}