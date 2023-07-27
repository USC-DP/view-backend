import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from 'src/entities/media.entity';
import { MediaTagEntity } from 'src/entities/mediatag.entity';
import { MediaCategoryDto } from 'src/models/photo-list-models';
import { Entity, Repository } from 'typeorm';

@Injectable()
export class MediaTagRepository extends Repository<MediaTagEntity> {

    constructor(
        @InjectRepository(MediaTagEntity)
        repository: Repository<MediaTagEntity>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async updateTags(mediaCategoriesDto: MediaCategoryDto) {

        let tagSet = new Set(mediaCategoriesDto.tags);
        let existingMediaTags = await this.find({ where: { mediaId: mediaCategoriesDto.mediaId } });

        for (const existingMediaTagRow of existingMediaTags) {
            // if the tag already exists in the db, ignore it from the incoming set
            if (tagSet.has(existingMediaTagRow.tag)) {
                tagSet.delete(existingMediaTagRow.tag)
                continue;
            } else {
                // if tag is not part of the incoming payload, delete this tag from db
                await this.delete({ mediaTagId: existingMediaTagRow.mediaTagId });
            }
        }

        // any remaining tags in the payload should be added
        for (const newIncomingTag of tagSet) {
            let addedTagRow = this.create({ mediaId: mediaCategoriesDto.mediaId, tag: newIncomingTag })
            await this.save(addedTagRow);
        }
        return;
    }

}