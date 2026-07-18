import {
 Injectable,
 NotFoundException
} from '@nestjs/common';


import { PrismaService } from '../prisma/prisma.service';

import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';


@Injectable()
export class ShowcaseService {


constructor(
private prisma:PrismaService
){}



create(dto:CreateShowcaseDto){

return this.prisma.showcase.create({

data:dto

});

}



findAll(){

return this.prisma.showcase.findMany({

orderBy:{
createdAt:'desc'
}

});

}



findByType(type:string){

return this.prisma.showcase.findMany({

where:{
type
}

});

}



update(
id:string,
dto:UpdateShowcaseDto
){

return this.prisma.showcase.update({

where:{
id
},

data:dto

});

}



remove(id:string){

return this.prisma.showcase.delete({

where:{
id
}

});

}


}