import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from './logger.service';
const log = console.log;

import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    // const logMessage = `[${new Date().toISOString()}] ${method} ${originalUrl} - ${
    //   userAgent.split(' ')[0]
    // } ${ip}`;

    // this.loggerService
    //   .sendLogMessage(logMessage)
    //   .then((rs) => console.log('success'));

    response.on('finish', async () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const logMessage = `[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} ${contentLength} - ${
        userAgent.split(' ')[0]
      } ${ip}`;

      await this.loggerService.sendLogMessage(logMessage);
    });

    response.on('error', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      // if (this.configService.get('NODE_ENV') === 'dev')
      const logMessage = `[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} ${contentLength} - ${
        userAgent.split(' ')[0]
      } ${ip}`;

      this.loggerService.sendLogMessage(logMessage);
    });

    next();
  }
}
