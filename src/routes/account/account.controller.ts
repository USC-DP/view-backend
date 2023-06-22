import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { AccountService } from "./account.service";
import { PassThrough } from "stream";


@Controller('/account')
export class AccountController {

    constructor(private readonly accountService: AccountService) { }
    
    @Post('/create')
    async createUser(
        @Body('username') username: string,
        @Body('password') password: string
    ) {
        return this.accountService.createUser(username, password);
    }

    @Get('/account/:id')
    async getAccountNameById(@Param('id') id: string) {
        return this.accountService.getAccountNameById(id);
    }
}