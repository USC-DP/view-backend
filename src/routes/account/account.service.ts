import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/services/prisma.service";

import * as bcrypt from 'bcrypt';


@Injectable()
export class AccountService {
    constructor(private db: PrismaService) { }

    async createUser(username: string, password: string) {

        const hashed = await bcrypt.hash(password, 10);

        let data: Prisma.UserCreateInput = {
            username: username,
            hashedPassword: hashed,
            accountType: 'user'
        }
        let result;
        try {
            result = await this.db.user.create({
                data,
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {
                    'status': false,
                    'msg': 'Account Already Exists'
                }
            }
        }

        return {
            'success': true,
            'username': result.username,
            'accountType': result.accountType,
            'id': result.userId
        }
    }

    async getAccountNameById(id: string) {
        return this.db.user.findUnique({
            where: {userId: id}
        })
    }

}