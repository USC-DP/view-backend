import { Body, Controller, Get, Param, Post, Request, Res, UseGuards } from "@nestjs/common";
import { MediaService } from "./media.service";
import { createReadStream } from "fs";
import { MediaCategoryDto } from "src/models/photo-list-models";
import { MediaDto } from "src/dto/media/media.dto";
import { SkipAuth } from "../auth/auth.decorators";
import { AuthGuard } from "../auth/auth.guard";


@Controller('/media')
export class MediaController {

    constructor(private readonly mediaService: MediaService) { }

    @Post("/add")
    async addPhoto(@Request() req, @Body() createMediaDto: MediaDto) {
        return this.mediaService.addPhoto(req.user.userId, createMediaDto);
    }

    @Get("/data/:id")
    async getPhotoById(@Request() req, @Param('id') id: string) {
        return this.mediaService.getPhotoDataById(req.user.userId, id);
    }

    //DEBUGGING ROUTE
    @SkipAuth()
    @Get("/from-owner/:id")
    async getPhotoPathsForUser(@Param('id') id: string) {
        return this.mediaService.getPhotoPathsForUser(id);
    }

    @SkipAuth()
    @Get("/view/:id")
    async getPhotoViewFromId(@Param('id') id: string, @Res() res) {
        let d = await this.mediaService.getPhotoPathById(id);
        d.pipe(res);
    }

    //GEODATA
    @Get("/all-geo-data/:id")
    async getAllPhotoGeoData(@Param('id') id: string) {
        return this.mediaService.getAllPhotoGeoData(id);
    }

    
    /*@Get("/sections/:searchTerm")
    async getSections(@Request() req, @Param("searchTerm") searchTerm: string) {
        return this.mediaService.getSections(searchTerm);
    }

    @Get("/sections/")
    async getSectionsEmpty() {
        return this.mediaService.getSections(null);
    }*/

    /*@Get("/search/:value")
    async searchMedia(@Param("value") value: string) {
        return this.mediaService.searchMedia(value);
    }*/

    /*@Get("/fetch-document/:id")
    async getDocument(@Param('id') id: string) {
        return this.mediaService.fetchMediaDocument(id);
    }*/

    /*@Get("/set-clip-embedding/:id")
    async setClipDocument(@Param('id') id: string) {
        return this.mediaService.setClipEmbeddings(id);
    }*/

    //DEBUGGING
    @Get("/fetch-all-documents")
    async fetchAllDocuments() {
        return this.mediaService.fetchAllDocuments();
    }

    /*@Post("/search-all-documents")
    async searchAllDocuments(@Body('clipEmbedding') clipEmbedding: number[]) {
        return this.mediaService.searchDocuments(clipEmbedding);
    }*/

    @Post("/search-sections/")
    async getSectionsFromSearch(@Request() req, @Body('search') searchStr: string) {
        return this.mediaService.getSectionsFromDocuments(req.user.userId, searchStr);
    }

    @Post("/search-segments/")
    async getSegmentsFromSearch(@Request() req, @Body('sectionId') sectionId, @Body('search') searchStr, @Body('amount') amountFromSection) {
        return this.mediaService.getSegmentsFromDocuments(req.user.userId, sectionId, searchStr, amountFromSection)
    }

    //todo
    /*@Get("/segments/:id")
    async getSegments(@Param('id') id: string, @Query('search') searchTerm?: string) {
        return this.mediaService.getSegments(id, searchTerm);
    }*/

    //TO-DO AUTH HERE
    @Post("/set-categories/")
    async postCategories(@Body() mediaCategoriesDto: MediaCategoryDto) {
        return this.mediaService.postCategories(mediaCategoriesDto);
    }

    @Get("/get-categories/:id")
    async getCategories(@Param("id") id) {
        return this.mediaService.getCategories(id);
    }
}