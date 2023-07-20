import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { MediaDto } from "src/dto/media/media.dto";
import { Media } from "src/entities/media.entity";
import { MediaCategoryDto, ViewMedia, ViewSection } from "src/models/photo-list-models";
import { Repository } from "typeorm";

@Injectable()
export class MediaService {

    constructor(
        @InjectRepository(Media)
        private mediaRepository: Repository<Media>
    ) { }

    async addPhoto(createMediaDto: MediaDto) {

        let mediaData = { ...createMediaDto, mediaType: 'image' };

        let media = this.mediaRepository.create(mediaData);
        return await this.mediaRepository.save(media);
    }

    async getPhotoDataById(id: string) {
        return this.mediaRepository.findOne({ where: { mediaId: id } });
    }

    async getPhotoPathsForUser(id: string) {

        /*const xprisma = this.db.$extends({
            result: {
                photo: {
                    src: {
                        needs: { photoId: true },
                        compute(photo) {
                            return `http://localhost:5000/photos/view/${photo.photoId}`
                        }
                    }
                }
            }
        })*/

        /*return xprisma.photo.findMany({
            select: {
                src: true,
                photoId: true,
                width: true,
                height: true,
            },
            where: { ownerId: id }
        })*/
    }

    async getPhotoPathById(id: string) {
        /*return this.db.photo.findUnique({
            select: { path: true },
            where: { photoId: id }
        })*/
    }

    async getAllPhotoGeoData(id: string) {
        /*const xprisma = this.db.$extends({
            result: {
                photo: {
                    src: {
                        needs: { photoId: true },
                        compute(photo) {
                            return `http://localhost:5000/photos/view/${photo.photoId}`
                        }
                    }
                }
            }
        })

        return xprisma.photo.findMany({
            select: {
                src: true,
                photoId: true,
                lat: true,
                lon: true
            },
            where: { ownerId: id }
        })*/
    }

    async getSections(searchTerm) {

        /*return this.db.$queryRaw
            `
                SELECT strftime('%Y-%m', datetime(dateTaken/1000, 'unixepoch')) AS sectionId, COUNT(*) AS totalMedia
                FROM "Photo" AS p
                LEFT JOIN "PhotoTag" AS pt ON p.photoId = pt.photoId
                WHERE pt.tag = ${searchTerm} or ${searchTerm} IS NULL
                GROUP BY sectionId
                ORDER BY sectionId DESC
                `;*/

    }

    async getSegments(id: string, searchTerm?: string) {
        /*
        if (!searchTerm) {
            searchTerm = null;
        }
        interface ViewMediaExpanded extends ViewMedia { segmentId: string }

        let expandedSegments: ViewMediaExpanded[] = await this.db.$queryRaw
            `
            SELECT strftime('%Y-%m-%d', datetime(dateTaken/1000, 'unixepoch')) as segmentId,
            p.photoId AS mediaId, width, height
            FROM "Photo" AS p
            LEFT JOIN "PhotoTag" AS pt ON p.photoId = pt.photoId
            WHERE strftime('%Y-%m', datetime(dateTaken/1000, 'unixepoch')) = ${id} AND (pt.tag = ${searchTerm} or ${searchTerm} IS NULL)
            ORDER BY segmentId DESC
        `

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
        }, []);*/
    }

    async postCategories(mediaCategoriesDto: MediaCategoryDto) {
        /*let count = await this.db.photo.count({ where: { photoId: mediaCategoriesDto.photoId } });
        if (count) {
            let tagSet = new Set(mediaCategoriesDto.tag);
            let existingPhotoTags = await this.db.photoTag.findMany({
                where: { photoId: mediaCategoriesDto.photoId }
            })

            for (const existingPhotoTagRow of existingPhotoTags) {
                if (tagSet.has(existingPhotoTagRow.tag)) {
                    tagSet.delete(existingPhotoTagRow.tag);
                    continue;
                } else {
                    let removedRow = await this.db.photoTag.delete({
                        where: { photoTagId: existingPhotoTagRow.photoTagId }
                    })
                }
            }

            for (const newTag of tagSet) {
                let addedNewTag = await this.db.photoTag.create({
                    data: {
                        photoId: mediaCategoriesDto.photoId,
                        tag: newTag
                    }
                })
            }
        }
        return;*/
    }

    async getCategories(id: string) {
        /*return this.db.photoTag.findMany({
            select: { tag: true },
            where: { photoId: id }
        })*/
    }
}