import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from 'src/entities/media.entity';
import { Entity, Repository } from 'typeorm';

@Injectable()
export class MediaRepository extends Repository<MediaEntity> {

    constructor(
        @InjectRepository(MediaEntity)
        repository: Repository<MediaEntity>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }


    async findAllPhotosByOwnerId(ownerId: string) {
        return this.createQueryBuilder('media')
            .where('media.ownerId = :ownerId', { ownerId })
            .getMany();
    }

    async getAllGeodataFromOwnerId(ownerId: string) {
        return this.createQueryBuilder('media')
            .select(['media.lat', 'media.lon'])
            .where('media.ownerId = :ownerId', { ownerId })
            .getMany();
    }


    //todo add user auth
    async getSectionsForSearchTerm(searchTerm: string | null) {
        const query =
            `
                SELECT strftime('%Y-%m', dateTaken) AS sectionId, COUNT(*) AS totalMedia
                FROM "Media" AS p
                LEFT JOIN "MediaTag" AS pt ON p.mediaId = pt.mediaId
                WHERE pt.tag = $1 or $1 IS NULL
                GROUP BY sectionId
                ORDER BY sectionId DESC
                `
        return await this.query(query, [searchTerm]);
    }

    async getSegments(segmentId: string, searchTerm: string | null) {
        const query =
            `
            SELECT strftime('%Y-%m-%d', dateTaken) as segmentId,
            p.mediaid AS mediaId, width, height
            FROM "Media" AS p
            LEFT JOIN "MediaTag" AS pt ON p.mediaId = pt.mediaId
            WHERE strftime('%Y-%m', dateTaken) = $1 AND (pt.tag = $2 or $2 IS NULL)
            ORDER BY segmentId DESC
        `
        return await this.query(query,[segmentId, searchTerm])
    }
}