import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { ConsumerService } from './utils/consumer.service';

@Injectable()
export class AppService {
  constructor(private readonly consumerService: ConsumerService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getLogs(): Promise<{ message: string; logs: string[] }> {
    try {
      const fileName = `${Date.now()}.txt`;

      const path = join('src', '..', 'log-files', fileName);

      const logs = await this.consumerService.getAllLogs(path);
      return {
        message: `log file is generated with name: "log-files -> ${fileName}"`,
        logs,
      };
    } catch (error) {
      throw new Error('Failed to retrieve logs from RabbitMQ.');
    }
  }
}
