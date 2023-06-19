import { Body, Controller, Get, Post } from "@nestjs/common";
import { PhotosService } from "./photos.service";
import { PrismaService } from "src/services/prisma.service";
import { User as UserModel } from '@prisma/client';


@Controller('/photos')
export class PhotosController {

    constructor(private readonly ps: PhotosService,
        private readonly prisma: PrismaService) { }
}