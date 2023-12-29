import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { firstValueFrom, map, switchMap, tap } from "rxjs";
import { MediaDto } from "src/dto/media/media.dto";
import { MediaEntity } from "src/entities/media.entity";
import { MediaTagEntity } from "src/entities/mediatag.entity";
import { MediaCategoryDto, ViewMedia, ViewSection } from "src/models/photo-list-models";
import { MediaRepository } from "src/repositories/media.repository";
import { MediaTagRepository } from "src/repositories/mediatag.repository";
import { TypesenseRepository } from "src/repositories/typsense.repositoru";
import { EmbeddingsService } from "src/services/embeddings.service";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';


@Injectable()
export class MediaService {

    constructor(
        @InjectRepository(MediaRepository)
        private mediaRepository: MediaRepository,
        @InjectRepository(MediaTagRepository)
        private mediaTagRepository: MediaTagRepository,
        private typeSenseRepository: TypesenseRepository,
        private embeddingsService: EmbeddingsService
    ) {

        this.instantiateTypseSense();
    }

    async instantiateTypseSense() {
        try {
            const data = await this.typeSenseRepository.instantiate()
            console.log("collection created")
            //need to sync with database
            const allMedia = await this.mediaRepository.find();
            for (const media of allMedia) {

                this.getMediaClipEmbeddingsAndUpsert(media);
            }
            console.log("collection synced with database")

        } catch (error) {
            console.log('do not have to sync database', error);
        }
    }


    formatDateToYYYYMM(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-indexed

        return `${year}-${month}`;
    }

    formatDateToYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-indexed
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }


    async getMediaClipEmbeddingsAndUpsert(media: MediaEntity) {
        this.embeddingsService.getMediaEmbedding(media.mediaId).pipe(tap(response => {
            if (response.data.success) {
                let date = new Date(media.dateTaken);
                this.typeSenseRepository.insertDocument({ id: media.mediaId, clipEmbeddings: response.data.data, segmentId: this.formatDateToYYYYMMDD(date), sectionId: this.formatDateToYYYYMM(date), width: media.width, height: media.height, date: date.valueOf(), ownerId: media.ownerId })
            }
        })).subscribe()
    }

    async addPhoto(userId: string, createMediaDto: MediaDto) {

        let mediaData = { ...createMediaDto, ownerId: userId, mediaType: 'image', width: parseInt(createMediaDto.width), height: parseInt(createMediaDto.height) };

        //return this.typeSenseRepository.insertDocument(mediaData);
        let media = this.mediaRepository.create(mediaData);



        let savedData = await this.mediaRepository.save(media);
        this.getMediaClipEmbeddingsAndUpsert(savedData);
        return savedData
    }

    async uploadMedia(userId, file: Express.Multer.File, createMediaDto: MediaDto) {
        const parts = file.originalname.split('.');
        const mediaUUID = uuidv4();
        const filePath = "C:\\Users\\Dennis\\Desktop\\ViewApp\\view-backend\\photos\\" + mediaUUID + "." + parts[parts.length - 1].toLocaleLowerCase();

        try {
            fs.writeFileSync(filePath, file.buffer);
            let mediaData = { ...createMediaDto, path: filePath, ownerId: userId, mediaType: 'image', width: parseInt(createMediaDto.width), height: parseInt(createMediaDto.height), mediaId: mediaUUID };
            let media = this.mediaRepository.create(mediaData);
            let savedData = await this.mediaRepository.save(media);
            this.getMediaClipEmbeddingsAndUpsert(savedData);
            return savedData;

        } catch (error) {
            console.log(error);
        }

    }

    async fetchAllDocuments() {
        return this.typeSenseRepository.fetchAllDocuments();
    }

    async getPhotoDataById(userId: string, id: string) {
        return this.mediaRepository.findOne({ where: { mediaId: id, ownerId: userId } });
    }

    async getPhotoPathsForUser(id: string) {
        return this.mediaRepository.findAllPhotosByOwnerId(id);
    }

    async getPhotoPathById(id: string) {
        const media = await this.mediaRepository.findOne({ where: { mediaId: id } });
        return createReadStream(media.path);
    }

    async getAllPhotoGeoData(id: string) {
        return this.mediaRepository.getAllGeodataFromOwnerId(id);
    }

    async getSectionsFromDocuments(userId: string, searchTerm: string) {
        let response = await firstValueFrom(this.embeddingsService.getWordEmbedding(searchTerm))

        if (response.data.success) {
            return this.typeSenseRepository.getMediaSectionsFromDocuments(userId, response.data.data);
        }
    }

    async getSegmentsFromDocuments(userId: string, sectionId: string, searchTerm: string, amountFromSection: number) {
        let response = await firstValueFrom(this.embeddingsService.getWordEmbedding(searchTerm))
        if (response.data.success) {
            return this.typeSenseRepository.getSegmentsForSearchTerm(userId, sectionId, response.data.data, amountFromSection);
        }
    }

    async getSegments(id: string, searchTerm: string | null) {
        if (!searchTerm) {
            searchTerm = null
        }

        interface ViewMediaExpanded extends ViewMedia { segmentId: string }

        let expandedSegments: ViewMediaExpanded[] = await this.mediaRepository.getSegments(id, searchTerm);


        return expandedSegments.reduce((acc, obj) => {
            const { segmentId, mediaId, width, height } = obj;

            let section = acc.find((item) => item.segmentId === segmentId);
            if (section) {
                section.media.push({ width, height, mediaId });
            } else {
                section = {
                    segmentId: segmentId,
                    media: [{ width, height, mediaId }]
                };
                acc.push(section);
            }
            return acc;
        }, []);
    }

    async postCategories(mediaCategoriesDto: MediaCategoryDto) {
        let count = this.mediaRepository.count({ where: { mediaId: mediaCategoriesDto.mediaId } });

        // only if media even exists
        if (count) {
            this.mediaTagRepository.updateTags(mediaCategoriesDto);
        }
    }

    async getCategories(id: string) {
        return this.mediaTagRepository.find({ select: { tag: true }, where: { mediaId: id } })
    }
}