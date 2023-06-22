import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { User, Prisma } from '@prisma/client';


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
}