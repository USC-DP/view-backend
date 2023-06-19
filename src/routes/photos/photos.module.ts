import { Module } from "@nestjs/common";
import { PhotosController } from "./photos.controller";
import { PhotosService } from "./photos.service";
import { PrismaService } from "src/services/prisma.service";


@Module({
    imports: [],
    controllers: [PhotosController],
    providers: [PhotosService, PrismaService]
})

export class PhotosModule {}