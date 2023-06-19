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
    
    /*async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        })
    }*/
}