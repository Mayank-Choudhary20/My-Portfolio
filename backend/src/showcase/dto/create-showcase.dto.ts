import {
 IsString,
 IsOptional,
 IsBoolean,
 IsArray
} from 'class-validator';


export class CreateShowcaseDto {


@IsString()
title:string;


@IsString()
type:string;


@IsString()
description:string;


@IsString()
imageUrl:string;


@IsOptional()
@IsString()
liveUrl?:string;


@IsOptional()
@IsString()
githubUrl?:string;


@IsArray()
technologies:string[];


@IsOptional()
@IsBoolean()
featured?:boolean;


}