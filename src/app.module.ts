import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { OrdersModule } from './orders/orders.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { LoggerService } from './utils/logger.service';
import { LoggerMiddleware } from './utils/utils.logger';
import { ConsumerService } from './utils/consumer.service';

const envFilePath: string = join(
  'src',
  'configs',
  `config.${process.env.NODE_ENV}.env`,
);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    UsersModule,
    TagsModule,
    BooksModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService, LoggerMiddleware, ConsumerService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
