import {
 Injectable,
 NotFoundException
} from '@nestjs/common';


import { PrismaService } from '../prisma/prisma.service';

import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';



@Injectable()
export class AiService {


constructor(
 private prisma:PrismaService
){}



create(dto:CreateAiDto){

 return this.prisma.aiKnowledge.create({
   data:dto
 });

}



findAll(){

 return this.prisma.aiKnowledge.findMany({
   orderBy:{
    createdAt:'desc'
   }
 });

}



async findOne(id:string){

 const data =
 await this.prisma.aiKnowledge.findUnique({
  where:{
   id
  }
 });


 if(!data)
 throw new NotFoundException(
  "AI knowledge not found"
 );


 return data;

}



update(
 id:string,
 dto:UpdateAiDto
){

 return this.prisma.aiKnowledge.update({

 where:{
  id
 },

 data:dto

 });

}



remove(id:string){

 return this.prisma.aiKnowledge.delete({

 where:{
  id
 }

 });

}



}