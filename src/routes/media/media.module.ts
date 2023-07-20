import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaEntity } from "src/entities/media.entity";
import { MediaRepository } from "src/repositories/media.repository";


@Module({
    imports: [TypeOrmModule.forFeature([MediaEntity, MediaRepository])],
    controllers: [MediaController],
    providers: [MediaService, MediaRepository]
})

export class MediaModule {}