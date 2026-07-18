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


import { ShowcaseService } from './showcase.service';

import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';



@Controller('showcase')
export class ShowcaseController {


constructor(
private showcaseService:ShowcaseService
){}



@Get()
findAll(){

return this.showcaseService.findAll();

}



@Get(':type')
findType(
@Param('type') type:string
){

return this.showcaseService.findByType(type);

}



@UseGuards(JwtAuthGuard)
@Post()
create(
@Body() dto:CreateShowcaseDto
){

return this.showcaseService.create(dto);

}



@UseGuards(JwtAuthGuard)
@Patch(':id')
update(
@Param('id') id:string,
@Body() dto:UpdateShowcaseDto
){

return this.showcaseService.update(
id,
dto
);

}



@UseGuards(JwtAuthGuard)
@Delete(':id')
remove(
@Param('id') id:string
){

return this.showcaseService.remove(id);

}


}