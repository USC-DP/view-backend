import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhotosModule } from './routes/photos/photos.module';
import { AccountModule } from './routes/account/account.module';

@Module({
  imports: [PhotosModule,
    AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
