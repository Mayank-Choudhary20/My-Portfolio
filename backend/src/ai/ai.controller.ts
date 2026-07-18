import {
 Controller,
 Get,
 Post,
 Body,
 Param,
 Patch,
 Delete,
 UseGuards
} from '@nestjs/common';


import { AiService } from './ai.service';

import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';



@Controller('ai')
export class AiController {


constructor(
 private aiService:AiService
){}



@UseGuards(JwtAuthGuard)
@Post()
create(
 @Body() dto:CreateAiDto
){

 return this.aiService.create(dto);

}



@Get()
findAll(){

 return this.aiService.findAll();

}



@Get(':id')
findOne(
 @Param('id') id:string
){

 return this.aiService.findOne(id);

}



@UseGuards(JwtAuthGuard)
@Patch(':id')
update(
 @Param('id') id:string,
 @Body() dto:UpdateAiDto
){

 return this.aiService.update(id,dto);

}



@UseGuards(JwtAuthGuard)
@Delete(':id')
remove(
 @Param('id') id:string
){

 return this.aiService.remove(id);

}


}