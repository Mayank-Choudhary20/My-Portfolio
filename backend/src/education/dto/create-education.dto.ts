import {
 IsString,
 IsOptional,
 IsDateString
} from 'class-validator';


export class CreateEducationDto {


@IsString()
degree:string;


@IsString()
institution:string;


@IsOptional()
@IsString()
field?:string;


@IsDateString()
startDate:string;


@IsOptional()
@IsDateString()
endDate?:string;


@IsOptional()
@IsString()
grade?:string;


@IsOptional()
@IsString()
description?:string;


@IsOptional()
@IsString()
certificateUrl?:string;


}