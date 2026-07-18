import {
 Injectable,
 NotFoundException
} from '@nestjs/common';


import { PrismaService } from '../prisma/prisma.service';

import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';



@Injectable()
export class SkillsService {


constructor(
private prisma:PrismaService
){}



create(dto:CreateSkillDto){

return this.prisma.skill.create({

data:dto

});

}



findAll(){

return this.prisma.skill.findMany({

orderBy:{
featured:'desc'
}

});

}



async findOne(id:string){


const skill =
await this.prisma.skill.findUnique({

where:{
id
}

});


if(!skill){

throw new NotFoundException(
"Skill not found"
);

}


return skill;


}



update(
id:string,
dto:UpdateSkillDto
){


return this.prisma.skill.update({

where:{
id
},

data:dto

});


}



remove(id:string){


return this.prisma.skill.delete({

where:{
id
}

});


}


}