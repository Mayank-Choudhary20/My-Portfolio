import {
 IsString,
 IsOptional,
 IsBoolean,
 IsNumber
} from 'class-validator';


export class CreateSkillDto {


@IsString()
name:string;


@IsString()
category:string;


@IsString()
level:string;


@IsOptional()
@IsString()
icon?:string;


@IsOptional()
@IsNumber()
years?:number;


@IsOptional()
@IsBoolean()
featured?:boolean;


}