import {
  IsString,
  IsOptional,
} from 'class-validator';


export class CreateAiDto {


  @IsString()
  question:string;


  @IsString()
  answer:string;


  @IsOptional()
  @IsString()
  category?:string;


}