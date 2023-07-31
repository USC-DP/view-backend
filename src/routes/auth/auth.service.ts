import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from '../account/account.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private accountService: AccountService) { }

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

        const { password: p, ...result } = user;
        return result;
    }
}
