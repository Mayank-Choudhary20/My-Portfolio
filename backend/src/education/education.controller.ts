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


import { EducationService } from './education.service';

import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';



@Controller('education')
export class EducationController {


constructor(
private educationService:EducationService
){}



@Get()
findAll(){

return this.educationService.findAll();

}



@Get(':id')
findOne(
@Param('id') id:string
){

return this.educationService.findOne(id);

}



@UseGuards(JwtAuthGuard)
@Post()
create(
@Body() dto:CreateEducationDto
){

return this.educationService.create(dto);

}



@UseGuards(JwtAuthGuard)
@Patch(':id')
update(
@Param('id') id:string,
@Body() dto:UpdateEducationDto
){

return this.educationService.update(
id,
dto
);

}



@UseGuards(JwtAuthGuard)
@Delete(':id')
remove(
@Param('id') id:string
){

return this.educationService.remove(id);

}


}