import { Module } from '@nestjs/common';

import { ShowcaseController } from './showcase.controller';
import { ShowcaseService } from './showcase.service';

import { PrismaModule } from '../prisma/prisma.module';


@Module({

imports:[
PrismaModule
],

controllers:[
ShowcaseController
],

providers:[
ShowcaseService
]

})
export class ShowcaseModule {}