import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Eta } from 'eta';
import * as process from 'node:process';
import * as path from 'node:path';

import { MailConfig } from './config';
import { MailDto } from './dtos';

export const IMailService = Symbol('__NOTIFICATIONS_MAIL_SERVICE__');

export interface IMailService {
  sendVerification(receiver: string, confirmUrl: string, username: string): Promise<void>;
  sendMail(receiver: string | string[], mail: MailDto): Promise<void>;
}

@Injectable()
export class MailService implements IMailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailConfig: MailConfig) {}

  async sendVerification(receiver: string, confirmUrl: string, username: string): Promise<void> {
    this.logger.log(`Sending verification email to ${receiver}`);

    try {
      await this.sendMail(receiver, {
        subject: 'Thrive | Mail verification',
        templateDirectory: 'email-verification',
        templateContext: { confirmUrl, username },
      });
    } catch (error) {
      this.logger.error(`Error while sending verification email to user: ${receiver}`);

      throw error;
    }

    this.logger.log('Email sent successfully');
  }

  async sendMail(receiver: string | string[], mail: MailDto): Promise<void> {
    const transporter = nodemailer.createTransport({ ...this.mailConfig });

    const eta = new Eta({
      views: path.resolve(process.cwd(), path.join('apps', 'notifications', 'src', 'mail', 'templates')),
    });

    const textContent = await eta.renderAsync(path.join(mail.templateDirectory, 'text'), mail.templateContext);
    const htmlContent = await eta.renderAsync(path.join(mail.templateDirectory, 'html'), mail.templateContext);

    await transporter.sendMail({
      from: `${this.mailConfig.displayName} <${this.mailConfig.mail}>`,
      to: receiver,
      subject: mail.subject,
      text: textContent,
      html: htmlContent,
    });
  }
}
