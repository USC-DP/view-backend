import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaModule } from './routes/media/media.module';
import { AccountModule } from './routes/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [MediaModule,
    AccountModule,
  
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: "./database/database.db",
      synchronize: true,
      entities: [__dirname + "/entities/*.entity{.ts,.js}"]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
