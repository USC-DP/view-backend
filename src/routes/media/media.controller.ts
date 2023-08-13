import { Body, Controller, Get, Param, Post, StreamableFile, Res, Query } from "@nestjs/common";
import { MediaService } from "./media.service";
import { createReadStream } from "fs";
import { MediaCategoryDto } from "src/models/photo-list-models";
import { MediaDto } from "src/dto/media/media.dto";
import { SkipAuth } from "../auth/auth.decorators";


@Controller('/media')
export class MediaController {

    constructor(private readonly mediaService: MediaService) { }

    @Post("/add")
    async addPhoto(@Body() createMediaDto: MediaDto) {
        return this.mediaService.addPhoto(createMediaDto);
    }

    @Get("/data/:id")
    async getPhotoById(@Param('id') id: string) {
        return this.mediaService.getPhotoDataById(id);
    }

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

    @Get("/all-geo-data/:id")
    async getAllPhotoGeoData(@Param('id') id: string) {
        return this.mediaService.getAllPhotoGeoData(id);
    }

    @Get("/sections/:searchTerm")
    async getSections(@Param("searchTerm") searchTerm: string) {
        return this.mediaService.getSections(searchTerm);
    }

    @Get("/sections/")
    async getSectionsEmpty() {
        return this.mediaService.getSections(null);
    }

    @Get("/search/:value")
    async searchMedia(@Param("value") value: string) {
        return this.mediaService.searchMedia(value);
    }

    /*@Get("/fetch-document/:id")
    async getDocument(@Param('id') id: string) {
        return this.mediaService.fetchMediaDocument(id);
    }*/

    /*@Get("/set-clip-embedding/:id")
    async setClipDocument(@Param('id') id: string) {
        return this.mediaService.setClipEmbeddings(id);
    }*/

    @Get("/fetch-all-documents")
    async fetchAllDocuments() {
        return this.mediaService.fetchAllDocuments();
    }

    @Post("/search-all-documents")
    async searchAllDocuments(@Body('clipEmbedding') clipEmbedding: number[]) {
        return this.mediaService.searchDocuments(clipEmbedding);
    }

    @Post("/search-sections/")
    async getSectionsFromSearch(@Body('search') searchStr: string) {
        return this.mediaService.getSectionsFromDocuments(searchStr);
    }

    @Post("/search-segments/")
    async getSegmentsFromSearch(@Body('sectionId') sectionId, @Body('search') searchStr, @Body('amount') amountFromSection) {
        return this.mediaService.getSegmentsFromDocuments(sectionId, searchStr, amountFromSection)
    }

    //todo
    @Get("/segments/:id")
    async getSegments(@Param('id') id: string, @Query('search') searchTerm?: string) {
        return this.mediaService.getSegments(id, searchTerm);
    }

    @Post("/set-categories/")
    async postCategories(@Body() mediaCategoriesDto: MediaCategoryDto) {
        return this.mediaService.postCategories(mediaCategoriesDto);
    }

    @Get("/get-categories/:id")
    async getCategories(@Param("id") id) {
        return this.mediaService.getCategories(id);
    }
}