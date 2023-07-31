import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/dto/auth/auth.dto';
import { SkipAuth } from './auth.decorators';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @SkipAuth()
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

}
