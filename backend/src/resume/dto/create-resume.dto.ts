import { IsString } from 'class-validator';

export class CreateResumeDto {
  @IsString()
  title: string;

  @IsString()
  fileUrl: string;
}