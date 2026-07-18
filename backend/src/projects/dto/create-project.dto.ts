import {
 IsString,
 IsBoolean,
 IsArray,
} from 'class-validator';


export class CreateProjectDto {

 @IsString()
 title:string;


 @IsString()
 slug:string;


 @IsString()
 description:string;


 @IsString()
 imageUrl:string;


 @IsString()
 githubUrl:string;


 @IsString()
 liveUrl:string;


 @IsArray()
 technologies:string[];


 @IsBoolean()
 featured:boolean;

}