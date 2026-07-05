import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CirclesModule } from './circles/circles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CirclesModule,
  ],
})
export class AppModule {}
