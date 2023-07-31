import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MediaModule } from './routes/media/media.module';
import { AccountModule } from './routes/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypesenseRepository } from './repositories/typsense.repositoru';
import { AuthModule } from './routes/auth/auth.module';

@Module({
  imports: [MediaModule,
    AccountModule,
  
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: "./database/database.db",
      synchronize: true,
      entities: [__dirname + "/entities/*.entity{.ts,.js}"]
    }),
  
    AuthModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
