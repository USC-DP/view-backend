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
        type SectionType = {
            sectionId: string
            totalMedia: number
        }

        let sections: SectionType[] = []
        for (let i = 0; i < 120; i++) {
            let uuid = randomUUID();
            let section: SectionType = {
                sectionId: uuid,
                totalMedia: parseInt(uuid.substring(uuid.length - 1), 16) * 2
            }
            sections.push(section);
        }
        return sections;
    }

    async getSegments(id: string) {
        type MetaDataType = {
            width: number,
            height: number
        }
        type ImageType = {
            imageId: string,
            metadata: MetaDataType
        }
        type SegmentType = {
            segmentId: string,
            media: ImageType[]
        }

        let totalPhotos = parseInt(id.substring(id.length - 1), 16) * 2

        let segments: SegmentType[] = [];
        let segment: SegmentType = {
            segmentId: randomUUID(),
            media: []
        }
        for (let i = 0; i < totalPhotos; i++) {
            let image: ImageType = {
                imageId: randomUUID(),
                metadata: {
                    width: 1920, //Math.round(1920 + (Math.random() - 0.5) * 100),
                    height: 1080 //Math.round(1080 + (Math.random() - 0.5) * 100)
                }
            }
            segment.media.push(image);
            /*if (Math.random() > 0.99) {
                segments.push(segment);
                segment = {
                    segmentId: randomUUID(),
                    media: []
                }
            }*/
        }

        if (segment.media.length > 0) {
            segments.push(segment);
        }
        return segments;
    }
}