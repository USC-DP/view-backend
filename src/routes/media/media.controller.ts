import { Body, Controller, Get, Param, Post, StreamableFile, Res, Query } from "@nestjs/common";
import { MediaService } from "./media.service";
import { createReadStream } from "fs";
import { MediaCategoryDto } from "src/models/photo-list-models";
import { MediaDto } from "src/dto/media/media.dto";


@Controller('/photos')
export class MediaController {

    constructor(private readonly photoService: MediaService) { }

    @Post("/add")
    async addPhoto(@Body() createMediaDto: MediaDto) {
        return this.photoService.addPhoto(createMediaDto);
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
        d.pipe(res);
    }

    @Get("/all-geo-data/:id")
    async getAllPhotoGeoData(@Param('id') id: string) {
        return this.photoService.getAllPhotoGeoData(id);
    }

    @Get("/sections/:searchTerm")
    async getSections(@Param("searchTerm") searchTerm: string) {
        return this.photoService.getSections(searchTerm);
    }

    @Get("/sections/")
    async getSectionsEmpty() {
        return this.photoService.getSections(null);
    }

    @Get("/segments/:id")
    async getSegments(@Param('id') id: string, @Query('search') searchTerm?: string) {
        return this.photoService.getSegments(id, searchTerm);
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