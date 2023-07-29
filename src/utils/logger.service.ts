import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class LoggerService {
  constructor(private readonly configService: ConfigService) {}

  private readonly queueName = this.configService.get('QUEUE_NAME');
  private readonly rabbitmqUrl = this.configService.get('RABBITMQ_URL');

  async sendLogMessage(logMessage: string) {
    try {
      const connection = await amqp.connect(this.rabbitmqUrl);
      const channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });
      channel.sendToQueue(this.queueName, Buffer.from(logMessage), {
        persistent: true,
      });
      await channel.close();
      await connection.close();
    } catch (error) {}
  }
}
