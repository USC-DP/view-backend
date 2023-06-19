import { Body, Controller, Get, Post } from "@nestjs/common";
import { PhotosService } from "./photos.service";
import { PrismaService } from "src/services/prisma.service";
import { Prisma, User as UserModel } from '@prisma/client';


@Controller('/photos')
export class PhotosController {

    constructor(private readonly photoService: PhotosService) { }

    @Post("/add")
    async addPhoto(
        @Body('path') path: string,
        @Body('owner') owner: string,
        @Body('description') description?: string,
        @Body('lat') lat?: number,
        @Body('lon') lon?: number,
    ) {

        return this.photoService.addPhoto({
            path,
            owner: {
                connect: { username: owner }
            },
            lat,
            lon,
            description,
        });
    }
}