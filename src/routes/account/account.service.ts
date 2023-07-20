import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';


import * as bcrypt from 'bcrypt';
import { Account } from "src/entities/account.entity";


@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private acountRepository: Repository<Account>
    ) { }

    async createUser(username: string, password: string) {

        let hashed = await bcrypt.hash(password, 10)

        const user = this.acountRepository.create({ username, password: hashed })

        try {
            let savedUser = await this.acountRepository.save(user);
            return { ...savedUser, success: true, msg: "Account Created" }
        } catch (error: any) {
            if (error instanceof QueryFailedError && (error as any).driverError.code == "SQLITE_CONSTRAINT") {
                return { success: false, msg: "Account Already Exists" }
            }
        }
    }

    async getAccountNameById(id: string) {
        return await this.acountRepository.findOne({ select: {userId: true, username: true}, where: {userId: id}})
    }

}