import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { User, Prisma } from '@prisma/client';
import { randomUUID } from "crypto";


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
            where: {ownerId: id}
        })
    }

    async getPhotoPathById(id: string) {
        return this.db.photo.findUnique({
            select: {path: true},
            where: {photoId: id}
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
            where: {ownerId: id}
        })
    }

    async getSections() {

        let sections: ViewSection[] = []
        for (let i = 0; i < 120; i++) {
            let uuid = randomUUID();
            let section: ViewSection = {
                sectionId: uuid,
                totalMedia: parseInt(uuid.substring(uuid.length - 1), 16) * 2
            }
            sections.push(section);
        }
        return sections;
    }

    async getSegments(id: string) {

        let totalPhotos = parseInt(id.substring(id.length - 1), 16) * 2

        let segments: ViewSegment[] = [];
        let segment: ViewSegment = {
            segmentId: randomUUID(),
            media: []
        }
        for (let i = 0; i < totalPhotos; i++) {
            let image: ViewMedia = {
                mediaId: randomUUID(),
                metadata: {
                    mediaId: '032c24b8-f993-4f3a-9f44-851bf64ab8b8',
                    width: 1920,
                    height: 1080,
                }
            }
            segment.media.push(image);
            if (Math.random() > 0.5) {
                segments.push(segment);
                segment = {
                    segmentId: randomUUID(),
                    media: []
                }
            }
        }

        if (segment.media.length > 0) {
            segments.push(segment);
        }
        return segments;
    }
}