import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from 'src/entities/media.entity';
import { Repository } from 'typeorm';

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
}