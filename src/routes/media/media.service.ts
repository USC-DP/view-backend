import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { firstValueFrom, map, switchMap, tap } from "rxjs";
import { MediaDto } from "src/dto/media/media.dto";
import { MediaTagEntity } from "src/entities/mediatag.entity";
import { MediaCategoryDto, ViewMedia, ViewSection } from "src/models/photo-list-models";
import { MediaRepository } from "src/repositories/media.repository";
import { MediaTagRepository } from "src/repositories/mediatag.repository";
import { TypesenseRepository } from "src/repositories/typsense.repositoru";
import { EmbeddingsService } from "src/services/embeddings.service";
import { Repository } from "typeorm";

@Injectable()
export class MediaService {

    constructor(
        @InjectRepository(MediaRepository)
        private mediaRepository: MediaRepository,
        @InjectRepository(MediaTagRepository)
        private mediaTagRepository: MediaTagRepository,
        private typeSenseRepository: TypesenseRepository,
        private embeddingsService: EmbeddingsService
    ) { }

    async getMediaClipEmbeddings(mediaId: string) {
        this.embeddingsService.getMediaEmbedding(mediaId).pipe(tap(response => {
            if(response.data.success) {
                this.typeSenseRepository.insertDocument({id: mediaId, clipEmbeddings: response.data.data})
            }
    })).subscribe()
    }

    async addPhoto(createMediaDto: MediaDto) {

        let mediaData = { ...createMediaDto, mediaType: 'image' };
        
        //return this.typeSenseRepository.insertDocument(mediaData);
        let media = this.mediaRepository.create(mediaData);
        let savedData = await this.mediaRepository.save(media);
        this.getMediaClipEmbeddings(savedData.mediaId);
        return savedData
    }

    async fetchMediaDocument(documentId: string) {
        return this.typeSenseRepository.fetchDocument(documentId);
    }

    async fetchAllDocuments() {
        return this.typeSenseRepository.fetchAllDocuments();
    }

    async searchDocuments(vector: number[]) {
        return this.typeSenseRepository.searchDocuments(vector);
    }

    async searchMedia(value: string) {
        let response = await firstValueFrom(this.embeddingsService.getWordEmbedding(value))
        if (response.data.success) {
            return this.typeSenseRepository.searchDocuments(response.data.data);
        }
    }

    async getPhotoDataById(id: string) {
        return this.mediaRepository.findOne({ where: { mediaId: id } });
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

    async getSections(searchTerm) {
        return this.mediaRepository.getSectionsForSearchTerm(searchTerm);
    }

    async getSegments(id: string, searchTerm: string | null) {
        if (!searchTerm) {
            searchTerm = null
        }
        
        interface ViewMediaExpanded extends ViewMedia { segmentId: string }

        let expandedSegments: ViewMediaExpanded[] =  await this.mediaRepository.getSegments(id, searchTerm);
            

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
        
        // onlt if media even exists
        if (count) {
            this.mediaTagRepository.updateTags(mediaCategoriesDto);
        }
    }

    async getCategories(id: string) {
        return this.mediaTagRepository.find({ select: { tag: true }, where: { mediaId: id } })
    }
}