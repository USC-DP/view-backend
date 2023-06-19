import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhotosModule } from './routes/photos/photos.module';

@Module({
  imports: [PhotosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
