import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from '../account/account.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private accountService: AccountService,
    private jwtService: JwtService) { }

    async signIn(username: string, password: string): Promise<any> {
        const user = await this.accountService.findAccountByUsername(username);
        if (!user) {
            return new UnauthorizedException();
        }
        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException();
        }
        // valid account at this point;

        const payload = { userId: user.userId, username: user.username };
        return {
            id: user.userId,
            accessToken: await this.jwtService.signAsync(payload)
        }
    }
}
