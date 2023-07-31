import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { Module } from "@nestjs/common";
import { Account } from "src/entities/account.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Account])],
    controllers: [AccountController],
    providers: [AccountService],
    exports: [AccountService]
})

export class AccountModule {}