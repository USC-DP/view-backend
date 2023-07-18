import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { User, Prisma } from '@prisma/client';
import { randomUUID } from "crypto";
import { MediaCategoryDto, ViewMedia, ViewSection } from "src/models/photo-list-models";

@Injectable()
export class PhotosService {

    constructor(private readonly db: PrismaService) { }

    async addPhoto(data: Prisma.PhotoCreateInput) {
        return this.db.photo.create({
            data,
        });
    }

    async getPhotoDataById(id: string) {
        return this.db.photo.findUnique({
            where: { photoId: id }
        });
    }

    async getPhotoPathsForUser(id: string) {

        const xprisma = this.db.$extends({
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
                width: true,
                height: true,
            },
            where: { ownerId: id }
        })
    }

    async getPhotoPathById(id: string) {
        return this.db.photo.findUnique({
            select: { path: true },
            where: { photoId: id }
        })
    }

    async getAllPhotoGeoData(id: string) {
        const xprisma = this.db.$extends({
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
        })
    }

    async getSections(): Promise<ViewSection[]> {

        return this.db.$queryRaw
            `
        SELECT strftime('%Y-%m', datetime(dateTaken/1000, 'unixepoch')) AS sectionId, COUNT(*) AS totalMedia
        FROM "Photo"
        GROUP BY sectionId
        ORDER BY sectionId DESC
      `;
    }

    async getSegments(id: string) {

        interface ViewMediaExpanded extends ViewMedia { segmentId: string }

        let expandedSegments: ViewMediaExpanded[] = await this.db.$queryRaw
            `
            SELECT strftime('%Y-%m-%d', datetime(dateTaken/1000, 'unixepoch')) as segmentId,
            photoId AS mediaId, width, height
            FROM "Photo"
            WHERE strftime('%Y-%m', datetime(dateTaken/1000, 'unixepoch')) = ${id}
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
        }, []);
    }

    async postCategories(mediaCategoriesDto: MediaCategoryDto) {
        let count = await this.db.photo.count({ where: { photoId: mediaCategoriesDto.photoId } });
        if (count) {
            let tagSet = new Set(mediaCategoriesDto.tag);
            let existingPhotoTags = await this.db.photoTag.findMany({
                where: {photoId: mediaCategoriesDto.photoId }
            })

            for (const existingPhotoTagRow of existingPhotoTags) {
                if (tagSet.has(existingPhotoTagRow.tag)) {
                    tagSet.delete(existingPhotoTagRow.tag);
                    continue;
                } else {
                    let removedRow = await this.db.photoTag.delete({
                        where: {photoTagId: existingPhotoTagRow.photoTagId}
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
        return;
    }

    async getCategories(id: string) {
        return this.db.photoTag.findMany({
            select: {tag: true},
            where: {photoId: id}
        })
    }
}