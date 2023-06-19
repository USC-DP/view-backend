import { PrismaService } from "src/services/prisma.service";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { Module } from "@nestjs/common";


@Module({
    imports: [],
    controllers: [AccountController],
    providers: [AccountService, PrismaService]
})

export class AccountModule {}