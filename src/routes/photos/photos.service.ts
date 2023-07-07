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
}