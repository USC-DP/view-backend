import { Body, Controller, Get, Param, Post, StreamableFile, Res } from "@nestjs/common";
import { PhotosService } from "./photos.service";
import { PrismaService } from "src/services/prisma.service";
import { Prisma, User as UserModel } from '@prisma/client';
import { createReadStream } from "fs";
import { MediaCategoryDto } from "src/models/photo-list-models";


@Controller('/photos')
export class PhotosController {

    constructor(private readonly photoService: PhotosService) { }

    @Post("/add")
    async addPhoto(
        @Body('path') path: string,
        @Body('width') width: string,
        @Body('height') height: string,
        @Body('owner') owner: string,
        @Body('description') description?: string,
        @Body('lat') lat?: number,
        @Body('lon') lon?: number,
        @Body('dateTaken') dateTaken?: string,
    ) {
        return this.photoService.addPhoto({
            path,
            owner: {
                connect: { username: owner }
            },
            width: Number(width),
            height: Number(height),
            lat: Number(lat),
            lon: Number(lon),
            description,
            dateTaken: new Date(Date.parse(dateTaken))
        });
    }

    @Get("/photo/:id")
    async getPhotoById(@Param('id') id: string) {
        return this.photoService.getPhotoDataById(id);
    }

    @Get("/from-owner/:id")
    async getPhotoPathsForUser(@Param('id') id: string) {
        return this.photoService.getPhotoPathsForUser(id);
    }

    @Get("/view/:id")
    async getPhotoViewFromId(@Param('id') id: string, @Res() res) {
        let d = await this.photoService.getPhotoPathById(id);
        const file = createReadStream(d.path);
        file.pipe(res);
    }

    @Get("/all-geo-data/:id")
    async getAllPhotoGeoData(@Param('id') id: string) {
        return this.photoService.getAllPhotoGeoData(id);
    }

    @Get("/sections")
    async getSections() {
        return this.photoService.getSections();
    }

    @Get("/segments/:id")
    async getSegments(@Param('id') id: string) {
        return this.photoService.getSegments(id);
    }

    @Post("/photo/set-categories/")
    async postCategories(@Body() mediaCategoriesDto: MediaCategoryDto) {
        return this.photoService.postCategories(mediaCategoriesDto);
    }

    @Get("/photo/get-categories/:id")
    async getCategories(@Param("id") id) {
        return this.photoService.getCategories(id);
    }
    


}