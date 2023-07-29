import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ConsumerService {
  constructor(private readonly configService: ConfigService) {}

  private readonly queueName = this.configService.get('QUEUE_NAME');
  private readonly rabbitmqUrl = this.configService.get('RABBITMQ_URL');

  private readonly logs: string[] = [];

  async startConsumingLogs() {
    try {
      const connection = await amqp.connect(this.rabbitmqUrl);
      const channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      channel.consume(this.queueName, (msg) => {
        if (msg !== null) {
          const logMessage = msg.content.toString();

          // Process the log message here, e.g., save it to a log file or perform further actions
          this.logs.push(logMessage);

          channel.ack(msg);
        }
      });
      return this.logs;
    } catch (error) {}
  }

  async getAllLogs(fileName: string): Promise<string[]> {
    await this.startConsumingLogs();

    await writeFile(fileName, this.logs.join('\n'));
    return this.logs;
  }
}
