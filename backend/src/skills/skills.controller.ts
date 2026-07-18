import {
 Controller,
 Get,
 Post,
 Patch,
 Delete,
 Body,
 Param,
 UseGuards
} from '@nestjs/common';


import { SkillsService } from './skills.service';

import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';



@Controller('skills')
export class SkillsController {


constructor(
private skillsService:SkillsService
){}



@Get()
findAll(){

return this.skillsService.findAll();

}



@Get(':id')
findOne(
@Param('id') id:string
){

return this.skillsService.findOne(id);

}



@UseGuards(JwtAuthGuard)
@Post()
create(
@Body() dto:CreateSkillDto
){

return this.skillsService.create(dto);

}



@UseGuards(JwtAuthGuard)
@Patch(':id')
update(
@Param('id') id:string,
@Body() dto:UpdateSkillDto
){

return this.skillsService.update(
id,
dto
);

}



@UseGuards(JwtAuthGuard)
@Delete(':id')
remove(
@Param('id') id:string
){

return this.skillsService.remove(id);

}


}