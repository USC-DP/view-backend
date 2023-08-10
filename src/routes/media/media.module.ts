import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaEntity } from "src/entities/media.entity";
import { MediaRepository } from "src/repositories/media.repository";
import { MediaTagEntity } from "src/entities/mediatag.entity";
import { MediaTagRepository } from "src/repositories/mediatag.repository";
import { TypesenseRepository } from "src/repositories/typsense.repositoru";
import { HttpModule } from "@nestjs/axios";
import { EmbeddingsService } from "src/services/embeddings.service";


@Module({
    imports: [TypeOrmModule.forFeature([MediaEntity, MediaRepository, MediaTagEntity, MediaTagRepository]), HttpModule],
    controllers: [MediaController],
    providers: [MediaService, MediaRepository, MediaTagRepository, TypesenseRepository, EmbeddingsService]
})

export class MediaModule {}